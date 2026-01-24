const Login = () => {
    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-5 text-center">
                            <i className="bi bi-lock display-1 text-primary mb-4"></i>
                            <h3 className="mb-3">Módulo de Login</h3>
                            <div className="alert alert-info" role="alert">
                                <i className="bi bi-info-circle me-2"></i>
                                Este módulo será desarrollado por <strong>ESTEFANY</strong>
                            </div>
                            <p className="text-muted">
                                Aquí se implementará el formulario de autenticación con JWT
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
