import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FooterComponent from "./footer";
import "../landing/landing.css";
import NavbarComponent from "./NavBarLanding";
import ScrollToTopButton from "./ScrollTopButton";

const Home = () => {
  const navigate = useNavigate();

  const handleComprar = (producto) => {
    navigate("/formularioCompra", { state: { producto } });
  };

  const productos = [
    {
      titulo: "Camiseta Blanca Dry Fit",
      img: "https://mundopromocional.co/wp-content/uploads/2021/07/camiseta-blanca-para-sublimacion-dry-fit.jpg",
      precio: 25000,
      tallas: ["S", "M", "L"],
      colores: ["#FFFFFF", "#F8F8F8"],
      tela: "Poliéster"
    },
    {
      titulo: "Camiseta Estampada Negra",
      img: "https://media.falabella.com/falabellaCO/126470450_01/w=800,h=800,fit=pad",
      precio: 35000,
      tallas: ["M", "L", "XL"],
      colores: ["#000000", "#222222"],
      tela: "Algodón"
    },
    {
      titulo: "Hoodie Gris Oversize",
      img: "https://acdn-us.mitiendanube.com/stores/002/215/740/products/listaaaaa-929560a6741eb6ecd717471490857892-1024-1024.webp",
      precio: 60000,
      tallas: ["S", "M", "L", "XL"],
      colores: ["#AAAAAA", "#555555", "#333333"],
      tela: "Algodón"
    },
    {
      titulo: "Buzo Azul Marino",
      img: "https://saetasport.com/cdn/shop/files/BUZO_CAPOTERO_AZUL_OSCURO_2_85887777-edb2-4ca7-9dc3-93987af91555.jpg?v=1741642088",
      precio: 55000,
      tallas: ["M", "L"],
      colores: ["#0B3D91", "#002366"],
      tela: "Poliéster"
    },
    {
      titulo: "Camiseta Verde Estilo Army",
      img: "https://static.kiabi.es/images/camiseta-basica-verde-yo979_20_frb1.jpg",
      precio: 28000,
      tallas: ["S", "M", "L"],
      colores: ["#4B5320", "#556B2F"],
      tela: "Algodón"
    },
    {
      titulo: "Sudadera Negra",
      img: "https://blsfashion.com/wp-content/uploads/2024/09/3612230738560-scaled.webp",
      precio: 65000,
      tallas: ["M", "L", "XL"],
      colores: ["#000000"],
      tela: "Mezcla algodón/poliéster"
    },
  ];



  return (
    <div>
      <NavbarComponent />

      {/* Sección principal */}
      <section className="banner-landing">
        <Container fluid className="h-100">
          <Row className="h-100 align-items-center">
            <Col md={6} className="text-center text-md-start px-5">
              <h3 className="fst-italic fw-bold">
                "DISEÑA TU ESTILO, ESTAMPA TU IDENTIDAD"
              </h3>
              <p className="mt-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                molestie, neque non scelerisque ultricies, nisl dolor aliquet
                lectus, vitae aliquet elit erat eget nisi.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ¿Quiénes Somos? */}
      <div className="bg-light p-5 text-center d-flex justify-content-center">
        <div className="col-md-8">
          <h4 className="fw-bold">¿QUIÉNES SOMOS?</h4>
          <p className="mt-3">
            En Estampados Lies transformamos tus ideas en prendas únicas. Desde
            2022 personalizamos ropa y accesorios con serigrafía, sublimación,
            vinil textil y bordado. Con tecnología moderna y asesoría creativa,
            damos vida a diseños que reflejan tu estilo.
          </p>
        </div>
      </div>

      {/* Misión y Visión */}
      <section className="p-5 text-center bg-secondary bg-opacity-10">
        <Container>
          <Row>
            <Col md={6}>
              <div className="card-landing">
                <p className="card-landing-title">MISIÓN</p>
                <p className="card-landing-desc">
                  Brindar soluciones creativas en personalización de prendas y
                  accesorios, utilizando técnicas de estampado de alta calidad y
                  tecnología moderna.
                </p>
              </div>
            </Col>

            <Col md={6}>
              <div className="card-landing">
                <p className="card-landing-title">VISIÓN</p>
                <p className="card-landing-desc">
                  Ser una empresa reconocida por la innovación, calidad y el
                  compromiso con la satisfacción de nuestros clientes.
                </p>
                <div className="go-corner">
                  <div className="go-arrow"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Productos */}
      <section className="p-5 text-center" style={{ backgroundColor: "#e9ecef" }}>
        <Container>
          <h4 className="fw-bold text-dark">Productos</h4>
          <p className="text-secondary">¡Personaliza tu estilo, crea algo único!</p>
          <br />

          <Carousel
            interval={null}
            controls={true}
            indicators={true}
            pause={false}
            wrap={true}
          >
            {Array.from({ length: Math.ceil(productos.length / 3) }).map(
              (_, slideIndex) => (
                <Carousel.Item key={slideIndex}>
                  <Row className="justify-content-center">
                    {productos
                      .slice(slideIndex * 3, slideIndex * 3 + 3)
                      .map((producto, i) => (
                        <Col md={3} key={slideIndex * 3 + i}>
                          <Card className="shadow-sm h-100 product-card">
                            {/* Contenedor con overlay */}
                            <div className="card-img-container">
                              <Card.Img
                                variant="top"
                                src={producto.img}
                                alt={producto.titulo}
                                style={{
                                  width: "70%",
                                  height: "200px",
                                  objectFit: "contain",
                                  margin: "0 auto",
                                }}
                              />

                              {/* Overlay al pasar el mouse */}
                              <div className="overlay-info">
                                <h6 className="mb-3">Variantes disponibles</h6>

                                {producto.tallas && (
                                  <p>
                                    <strong>Tallas:</strong>{" "}
                                    {producto.tallas.join(", ")}
                                  </p>
                                )}

                                {producto.colores && (
                                  <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                                    <strong>Colores:</strong>
                                    <div className="d-flex gap-2">
                                      {producto.colores.map((color, idx) => (
                                        <span
                                          key={idx}
                                          className="color-circle"
                                          style={{ backgroundColor: color }}
                                        ></span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {producto.tela && (
                                  <p>
                                    <strong>Tela:</strong> {producto.tela}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Info básica */}
                            <Card.Body>
                              <div>

                                <h6 className="mb-1">{producto.titulo}</h6>
                                <p className="text-success fw-bold mb-2">
                                  {"$" + producto.precio.toLocaleString()}
                                </p>
                              </div>

                              <Button
                                variant="success"
                                className="w-100 mt-2"
                                onClick={() =>
                                  handleComprar({
                                    titulo: producto.titulo,
                                    img: producto.img,
                                    precio: producto.precio,
                                    estado: "Disponible",
                                  })
                                }
                                aria-label={`Comprar ${producto.titulo}`}
                              >
                                Comprar
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </Carousel.Item>
              )
            )}
          </Carousel>

        </Container>
      </section>

      <FooterComponent />

      <ScrollToTopButton />
    </div>
  );
};

export default Home;
