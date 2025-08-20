import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import type { Resource } from '../types';
import { ResourceType } from '../types';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  // const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceType, setNewResourceType] = useState<ResourceType>(ResourceType.ARTICLE);
  const [newResourceNotes, setNewResourceNotes] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiClient.get('/resources');
        setResources(data.resources);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiClient.post('/resources', {
        title: newResourceTitle,
        url: newResourceUrl,
        type: newResourceType,
        notes: newResourceNotes,
      });

      setResources((prev) => [data.resource, ...prev]);
      setNewResourceTitle('');
      setNewResourceUrl('');
      setNewResourceNotes('');
      setNewResourceType(ResourceType.ARTICLE);
    } catch (err) {
      console.error('Error adding resource:', err);
      setError('Failed to add resource.');
    }
  };

  const handleToggleResourceComplete = async (resourceId: string, currentCompleted: boolean) => {
    try {
      await apiClient.put(`/resources/${resourceId}`, { completed: !currentCompleted });

      setResources((prev) =>
        prev.map((res) => (res.id === resourceId ? { ...res, completed: !currentCompleted } : res))
      );
    } catch (err) {
      console.error('Error updating resource:', err);
      setError('Failed to update resource status.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-900 to-secondary-800 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-400 mx-auto mb-4"></div>
          <p className="text-xl text-primary-200">Loading your upskilling journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-900 text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">⚠️ Error</p>
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-700 hover:bg-red-600 px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-800 text-white p-6">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/20">
        <div>
          <h1 className="text-4xl font-extrabold text-primary-200 mb-2">
            Welcome back, {user?.email}!
          </h1>
          <p className="text-secondary-300">Track your progress and manage your learning resources</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Sign Out
        </button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Resource Section */}
        <section className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6 text-primary-200 flex items-center">
            <span className="mr-2">📚</span>
            Add New Resource
          </h2>
          <form onSubmit={handleAddResource} className="space-y-4">
            <div>
              <label htmlFor="resourceTitle" className="block text-sm font-medium text-gray-200 mb-1">
                Title
              </label>
              <input
                type="text"
                id="resourceTitle"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-300"
                placeholder="e.g., React Fundamentals Course"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="resourceUrl" className="block text-sm font-medium text-gray-200 mb-1">
                URL
              </label>
              <input
                type="url"
                id="resourceUrl"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-300"
                placeholder="https://example.com/course"
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="resourceType" className="block text-sm font-medium text-gray-200 mb-1">
                Type
              </label>
              <select
                id="resourceType"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white"
                value={newResourceType}
                onChange={(e) => setNewResourceType(e.target.value as ResourceType)}
              >
                {Object.values(ResourceType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="resourceNotes" className="block text-sm font-medium text-gray-200 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="resourceNotes"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-300 resize-none"
                placeholder="Any additional notes..."
                rows={3}
                value={newResourceNotes}
                onChange={(e) => setNewResourceNotes(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              ✨ Add Resource
            </button>
          </form>
        </section>

        {/* Resources List Section */}
        <section className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-primary-200 flex items-center">
            <span className="mr-2">📖</span>
            My Resources ({resources.length})
          </h2>
          {resources.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-secondary-300 text-lg">No resources added yet. Start by adding one!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className={`bg-white/5 p-4 rounded-lg border-l-4 transition-all duration-300 hover:bg-white/10 ${
                    resource.completed 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-primary-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <h3 className={`text-xl font-semibold ${
                        resource.completed ? 'line-through text-gray-400' : 'text-primary-200'
                      }`}>
                        {resource.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-secondary-300">
                        <span className="bg-primary-500/20 px-2 py-1 rounded-full">
                          {resource.type}
                        </span>
                        <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm break-all mt-2 inline-block hover:underline"
                      >
                        🔗 {resource.url}
                      </a>
                      {resource.notes && (
                        <p className="text-gray-300 text-sm mt-2 italic">
                          💭 {resource.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleResourceComplete(resource.id, resource.completed)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
                        resource.completed 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {resource.completed ? '🔄 Mark Incomplete' : '✅ Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Roadmaps Section */}
        <section className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-500/30 lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6 text-blue-300 flex items-center">
            <span className="mr-2">🗺️</span>
            Learning Roadmaps
          </h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚧</div>
            <p className="text-secondary-300 mb-4">
              Roadmaps feature coming soon! Create structured learning paths.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50" disabled>
              🆕 Create Roadmap
            </button>
          </div>
        </section>

        {/* Tasks Section */}
        <section className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-teal-500/30 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-teal-300 flex items-center">
            <span className="mr-2">✅</span>
            Tasks & Checklist
          </h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-secondary-300 mb-4">
              Tasks feature coming soon! Create granular tasks for each resource.
            </p>
            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50" disabled>
              ➕ Add New Task
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
