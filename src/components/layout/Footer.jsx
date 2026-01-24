const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-white mt-auto py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5>
                            <i className="bi bi-mortarboard me-2"></i>
                            SGIE - Sistema de Gestión de Institución Educativa
                        </h5>
                        <p className="text-muted mb-0">
                            Plataforma integral para la gestión académica y administrativa
                        </p>
                    </div>

                    <div className="col-md-6 text-md-end">
                        <p className="mb-2">
                            <i className="bi bi-envelope me-2"></i>
                            <a href="mailto:soporte@sgie.edu" className="text-decoration-none text-white-50">
                                soporte@sgie.edu
                            </a>
                        </p>
                        <p className="mb-0 text-muted">
                            © {currentYear} SGIE. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
