import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";

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
    },
    {
      titulo: "Camiseta Estampada Negra",
      img: "https://media.falabella.com/falabellaCO/126470450_01/w=800,h=800,fit=pad",
      precio: 35000,
    },
    {
      titulo: "Camiseta Blanca Dry Fit",
      img: "https://mundopromocional.co/wp-content/uploads/2021/07/camiseta-blanca-para-sublimacion-dry-fit.jpg",
      precio: 25000,
    },
    {
      titulo: "Camiseta Estampada Negra",
      img: "https://media.falabella.com/falabellaCO/126470450_01/w=800,h=800,fit=pad",
      precio: 35000,
    },
    {
      titulo: "Camiseta Blanca Dry Fit",
      img: "https://mundopromocional.co/wp-content/uploads/2021/07/camiseta-blanca-para-sublimacion-dry-fit.jpg",
      precio: 25000,
    },
    {
      titulo: "Camiseta Estampada Negra",
      img: "https://media.falabella.com/falabellaCO/126470450_01/w=800,h=800,fit=pad",
      precio: 35000,
    },
    {
      titulo: "Camiseta Blanca Dry Fit",
      img: "https://mundopromocional.co/wp-content/uploads/2021/07/camiseta-blanca-para-sublimacion-dry-fit.jpg",
      precio: 25000,
    },
    {
      titulo: "Camiseta Estampada Negra",
      img: "https://media.falabella.com/falabellaCO/126470450_01/w=800,h=800,fit=pad",
      precio: 35000,
    },
  ];

  return (
    <div>
      <NavbarComponent />

      {/* Sección principal */}
      <section className="text-center bg-dark text-white p-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img
                src="https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Camiseta"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6}>
              <h3 className="fst-italic">
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
                <div class="go-corner">
                  <div class="go-arrow"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Productos con carrusel */}
      <section
        className="p-5 text-center"
        style={{ backgroundColor: "#e9ecef" }}
      >
        <Container>
          <h4 className="fw-bold text-dark">Productos</h4>
          <p className="text-secondary">
            ¡Personaliza tu estilo, crea algo único!
          </p>
          <br />

          <Carousel interval={3000} controls indicators pause={false} wrap>
            {Array.from({ length: Math.ceil(productos.length / 4) }).map(
              (_, slideIndex) => (
                <Carousel.Item key={slideIndex}>
                  <Row className="justify-content-center">
                    {productos
                      .slice(slideIndex * 4, slideIndex * 4 + 4)
                      .map((producto, i) => (
                        <Col md={3} key={i}>
                          <Card className="shadow-sm h-100">
                            <Card.Img
                              variant="top"
                              src={producto.img}
                              style={{
                                width: "70%",
                                height: "200px",
                                objectFit: "contain",
                                margin: "0 auto",
                              }}
                            />
                            <Card.Body>
                              <h6>{producto.titulo}</h6>
                              <p className="text-success fw-bold">
                                ${producto.precio}
                              </p>
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
    </div>
  );
};

export default Home;
