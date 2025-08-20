import { 
  Table, 
  FileStack, 
  CheckCircle, 
  CircleDot, 
  Gamepad2, 
  Database, 
  Filter, 
  Search, 
  Settings, 
  Brain, 
  BarChart3, 
  Sliders, 
  ArrowRight, 
  ArrowDown,
  Download
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

export function MLInfographic() {
  const infographicRef = useRef<HTMLDivElement>(null);

  const downloadPNG = async () => {
    if (infographicRef.current) {
      try {
        // Hide the download button temporarily
        const downloadButton = document.querySelector('[data-download-btn]') as HTMLElement;
        if (downloadButton) {
          downloadButton.style.display = 'none';
        }

        const canvas = await html2canvas(infographicRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
        });
        
        // Show the download button again
        if (downloadButton) {
          downloadButton.style.display = 'flex';
        }

        const link = document.createElement('a');
        link.download = 'ML-Fundamentals-Infographic.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error generating PNG:', error);
        alert('Error generating PNG. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Download Button */}
      <div className="fixed top-4 right-4 z-10" data-download-btn>
        <Button 
          onClick={downloadPNG}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
      </div>

      <div 
        ref={infographicRef}
        className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen"
      >
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Fundamentals of Machine Learning for Beginners
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Section 1: The Foundation */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-blue-700">
            The Foundation (Key Concepts)
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-200 rounded-full">
                    <Table className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Structured Data</h3>
                <p className="text-blue-700 leading-relaxed">
                  Organized data in rows & columns (e.g., customer records, sales figures). 
                  Easy for ML models.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-200 rounded-full">
                    <FileStack className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Unstructured Data</h3>
                <p className="text-blue-700 leading-relaxed">
                  No predefined format (e.g., text, images, videos). 
                  Requires advanced techniques like NLP & Computer Vision.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 2: Machine Learning Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-green-700">
            Machine Learning Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-200 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">Supervised Learning</h3>
                <p className="text-green-700 leading-relaxed">
                  Learns from labeled data (input + output). 
                  Examples: house price prediction, spam detection.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-200 rounded-full">
                    <CircleDot className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">Unsupervised Learning</h3>
                <p className="text-green-700 leading-relaxed">
                  Learns patterns from unlabeled data. 
                  Examples: customer segmentation, product associations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-200 rounded-full">
                    <Gamepad2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-3">Reinforcement Learning</h3>
                <p className="text-green-700 leading-relaxed">
                  Learns by trial & error through rewards. 
                  Examples: training a robot, playing chess.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 3: The ML Lifecycle */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-8 text-purple-700">
            The ML Lifecycle (Flow Diagram)
          </h2>
          <div className="space-y-6">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Card className="bg-purple-100 border-purple-200 shadow-lg w-full md:w-64">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Database className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-purple-800">Data Collection</h4>
                </CardContent>
              </Card>
              <ArrowRight className="hidden md:block w-6 h-6 text-purple-500" />
              <ArrowDown className="md:hidden w-6 h-6 text-purple-500" />
              
              <Card className="bg-purple-100 border-purple-200 shadow-lg w-full md:w-64">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Filter className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-purple-800">Data Preprocessing</h4>
                  <p className="text-sm text-purple-600 mt-2">
                    Handling Missing Values, Encoding Categorical Data
                  </p>
                </CardContent>
              </Card>
              <ArrowRight className="hidden md:block w-6 h-6 text-purple-500" />
              <ArrowDown className="md:hidden w-6 h-6 text-purple-500" />
              
              <Card className="bg-purple-100 border-purple-200 shadow-lg w-full md:w-64">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Search className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-purple-800">Exploratory Data Analysis</h4>
                  <p className="text-sm text-purple-600 mt-1">(EDA)</p>
                </CardContent>
              </Card>
            </div>

            {/* Arrow down for mobile, curved arrow for desktop */}
            <div className="flex justify-center">
              <ArrowDown className="w-6 h-6 text-purple-500" />
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Card className="bg-purple-100 border-purple-200 shadow-lg w-full md:w-64">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Settings className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-purple-800">Model Selection</h4>
                </CardContent>
              </Card>
              <ArrowRight className="hidden md:block w-6 h-6 text-purple-500" />
              <ArrowDown className="md:hidden w-6 h-6 text-purple-500" />
              
              <Card className="bg-purple-100 border-purple-200 shadow-lg w-full md:w-64">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-purple-800">Model Training</h4>
                </CardContent>
              </Card>
              <ArrowRight className="hidden md:block w-6 h-6 text-purple-500" />
              <ArrowDown className="md:hidden w-6 h-6 text-purple-500" />
              
              <Card className="bg-purple-100 border-purple-200 shadow-lg w-full md:w-64">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-purple-800">Model Evaluation</h4>
                </CardContent>
              </Card>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center">
              <ArrowDown className="w-6 h-6 text-purple-500" />
            </div>

            {/* Final step */}
            <div className="flex justify-center">
              <Card className="bg-purple-100 border-purple-200 shadow-lg w-full md:w-64">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Sliders className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-purple-800">Hyperparameter Tuning</h4>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}