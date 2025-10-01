// src/components/modals/VerDetalles.jsx
import { FaTimes } from "react-icons/fa";

const VerDetalles = ({ show, onClose, title, data }) => {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1050
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{ maxWidth: "400px" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="modal-content"
                    style={{
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                    }}
                >
                    {/* Header */}
                    <div
                        className="modal-header"
                        style={{
                            background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
                            borderBottom: "none",
                            padding: "20px 25px",
                            borderTopLeftRadius: "12px",
                            borderTopRightRadius: "12px"
                        }}
                    >
                        <h5 className="modal-title fw-bold text-dark mb-0">
                            {title || "Detalle"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            style={{
                                fontSize: "0.8rem"
                            }}
                        />
                    </div>

                    {/* Body */}
                    <div
                        className="modal-body"
                        style={{
                            padding: "25px",
                            background: "#fafafa"
                        }}
                    >
                        {data && data.map((item, index) => (
                            <div
                                key={index}
                                className="mb-3"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingBottom: "12px",
                                    borderBottom: index < data.length - 1 ? "1px solid #e0e0e0" : "none"
                                }}
                            >
                                <span
                                    className="fw-semibold"
                                    style={{
                                        color: "#333",
                                        fontSize: "0.95rem",
                                        minWidth: "120px"
                                    }}
                                >
                                    {item.label}
                                </span>
                                <span
                                    style={{
                                        color: "#666",
                                        fontSize: "0.95rem",
                                        textAlign: "right",
                                        wordBreak: "break-word",
                                        maxWidth: "200px"
                                    }}
                                >
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div
                        className="modal-footer"
                        style={{
                            borderTop: "none",
                            padding: "15px 25px",
                            background: "#fafafa",
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px"
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn-danger w-100 fw-semibold"
                            onClick={onClose}
                            style={{
                                padding: "10px",
                                fontSize: "0.95rem",
                                borderRadius: "8px"
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerDetalles;