import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";

const Home = () => {
  const navigate = useNavigate();

  const handleComprar = (producto) => {
    navigate("/formularioCompra", { state: { producto } });
  };

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

      {/* ¿Quienes Somos? */}
      <div className="bg-light p-5 text-center d-flex justify-content-center">
        <div className="col-md-8">
          <h4 className="fw-bold">¿QUIENES SOMOS?</h4>
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
              <Card className="p-4 shadow-sm h-100 border border-2">
                <h5 className="fw-bold">MISIÓN</h5>
                <p className="mt-2">
                  Brindar soluciones creativas en personalización de prendas y
                  accesorios, utilizando técnicas de estampado de alta calidad y
                  tecnología moderna.
                </p>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-4 shadow-sm h-100 border border-2">
                <h5 className="fw-bold">VISIÓN</h5>
                <p className="mt-2">
                  Ser una empresa reconocida por la innovación, calidad y el
                  compromiso con la satisfacción de nuestros clientes.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Productos */}
      <section className="p-5 text-center bg-light">
        <Container className="bg-dark p-4">
          <h4 className="fw-bold text-white">Productos</h4>
          <p className="text-white">¡Personaliza tu estilo, crea algo único!</p>
          <br />
          <Row className="justify-content-center">
            {/* Producto 1 */}
            <Col md={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src="https://mundopromocional.co/wp-content/uploads/2021/07/camiseta-blanca-para-sublimacion-dry-fit.jpg"
                />
                <Card.Body>
                  <Button
                    variant="success"
                    className="w-100 mt-5"
                    onClick={() =>
                      handleComprar({
                        titulo: "Camiseta Blanca Dry Fit",
                        img: "https://mundopromocional.co/wp-content/uploads/2021/07/camiseta-blanca-para-sublimacion-dry-fit.jpg",
                        precio: 25000,
                        estado: "Disponible",
                      })
                    }
                  >
                    Comprar
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Producto 2 */}
            <Col md={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src="https://media.falabella.com/falabellaCO/126470450_01/w=800,h=800,fit=pad"
                />
                <Card.Body>
                  <Button
                    variant="success"
                    className="w-100 mt-5"
                    onClick={() =>
                      handleComprar({
                        titulo: "Camiseta Estampada Negra",
                        img: "https://media.falabella.com/falabellaCO/126470450_01/w=800,h=800,fit=pad",
                        precio: 35000,
                        estado: "Disponible",
                      })
                    }
                  >
                    Comprar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <FooterComponent />
    </div>
  );
};

export default Home;
