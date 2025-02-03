export const routeMappings = [
    {
        gatewayPath: '/user/login',
        targetPath: '/auth/login',
        service: 'auth',
        method: 'POST',
        protected: false,
        validatePayload: true,
    },
    {
        gatewayPath: '/user/register',
        targetPath: '/auth/register',
        service: 'auth',
        method: 'POST',
        protected: false,
        validatePayload: true,
    },
    {
        gatewayPath: '/users/one/:id',
        targetPath: '/users/one/:id',
        service: 'data',
        method: 'GET',
        protected: false,
        validatePayload: false,
    },
    {
        gatewayPath: '/users/all',
        targetPath: '/users/all',
        service: 'data',
        method: 'GET',
        protected: false,
        validatePayload: false,
    },
    {
        gatewayPath: '/users/update/:id',
        targetPath: '/auth/update/:id',
        service: 'auth',
        method: 'PUT',
        protected: false,
        validatePayload: true,
    },
    {
        gatewayPath: '/users/delete/:id',
        targetPath: '/users/delete/:id',
        service: 'data',
        method: 'DELETE',
        protected: true,
        validatePayload: false,
    },
];
