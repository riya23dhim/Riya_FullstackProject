export const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.message) {
        const msg = error.response.data.message;
        if (Array.isArray(msg)) return msg.join(', ');
        if (typeof msg === 'string') return msg;
        return JSON.stringify(msg);
    }
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
};
