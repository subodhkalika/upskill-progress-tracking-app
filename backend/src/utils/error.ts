export const isPrismaErrorCode = (error: any, code: string): boolean => {
    return typeof error === 'object' && error?.code === code;
}

export const isPrismaUniqueConstraintViolation = (error: any): boolean => {
    return isPrismaErrorCode(error, 'P2002') && error.meta?.target?.includes('name');
}