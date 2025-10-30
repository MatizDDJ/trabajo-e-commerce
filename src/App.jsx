import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Estilos personalizados
const styles = `
  :root {
    --tiendamia-red: #FF243A;
    --tiendamia-dark-red: #FF243A;
    --tiendamia-light-gray: #F5F5F5;
    --tiendamia-gray: #666666;
  }

  .hover-shadow:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
  }
  
  .transition-all {
    transition: all 0.3s ease-in-out;
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
  }

  html {
    scroll-behavior: smooth;
  }

  section {
    scroll-margin-top: 80px;
  }

  .navbar {
    background-color: var(--tiendamia-red) !important;
  }

  .nav-link {
    color: white !important;
    font-weight: 500;
  }

  .nav-link:hover {
    color: rgba(255,255,255,0.8) !important;
  }

  .btn-outline-light:hover {
    background-color: var(--tiendamia-dark-red);
    border-color: var(--tiendamia-dark-red);
  }

  .section-title {
    color: var(--tiendamia-red);
    font-weight: 600;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .card {
    border: none;
    transition: all 0.3s ease;
  }

  .card:hover {
    border-color: var(--tiendamia-red);
  }

  .badge.bg-primary {
    background-color: var(--tiendamia-red) !important;
  }

  .btn-primary {
    background-color: var(--tiendamia-red);
    border-color: var(--tiendamia-red);
  }

  .btn-primary:hover {
    background-color: var(--tiendamia-dark-red);
    border-color: var(--tiendamia-dark-red);
  }

  .text-primary {
    color: var(--tiendamia-red) !important;
  }

  .footer {
    background-color: var(--tiendamia-light-gray);
    color: var(--tiendamia-gray);
    padding: 2rem 0;
  }

  .product-price {
    color: var(--tiendamia-red);
    font-weight: bold;
    font-size: 1.25rem;
  }

  .category-header {
    background: linear-gradient(45deg, var(--tiendamia-red), var(--tiendamia-dark-red));
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }
`;

// Agregar estilos al documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Crear el contexto del carrito
const CartContext = createContext();

// Provider del carrito
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (!cart || cart.length === 0) {
        localStorage.removeItem('cart');
      } else {
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    } catch (e) {
      // ignore localStorage errors (e.g., storage full or disabled)
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const existingProduct = currentCart.find(item => item.id === product.id);
      if (existingProduct) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentCart, { ...product, quantity }];
    });
    toast.success('Producto añadido al carrito!');
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
    toast.info('Producto eliminado del carrito');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
  setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { cart } = useContext(CartContext);
  const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <div className="bg-dark text-white py-2">
        <div className="container">
          <div className="d-flex justify-content-end">
            <span className="me-3">¡Envío gratis en compras mayores a $99!</span>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <h1 className="h4 mb-0">Tech Colonia</h1>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#technology">Tecnología</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#jewelery">Joyería</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#mensClothing">Moda Hombre</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#womensClothing">Moda Mujer</a>
              </li>
            </ul>
            <Link to="/cart" className="btn btn-outline-light">
              <FontAwesomeIcon icon={faShoppingCart} />
              {itemsCount > 0 && <span className="ms-2 badge bg-light text-danger">{itemsCount}</span>}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const discount = Math.floor(Math.random() * 30 + 10); // Simula un descuento entre 10% y 40%
  const originalPrice = (product.price / (1 - discount/100)).toFixed(2);

  return (
    <div className="card h-100 shadow-sm hover-shadow transition-all">
      <div className="position-relative">
        <div className="position-absolute top-0 start-0 p-2">
          <span className="badge bg-danger">
            {discount}% OFF
          </span>
        </div>
        <img 
          src={product.image} 
          className="card-img-top p-4" 
          alt={product.title} 
          style={{ height: '200px', objectFit: 'contain' }} 
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate mb-2" style={{ fontSize: '0.9rem', height: '2.4rem', lineHeight: '1.2rem' }}>
          {product.title}
        </h5>
        <div className="mb-2">
          <small className="text-muted text-decoration-line-through">US$ {originalPrice}</small>
          <div className="product-price">US$ {product.price.toFixed(2)}</div>
        </div>
        <p className="card-text small text-muted mb-3" style={{ fontSize: '0.8rem' }}>
          ¡Comprá en hasta 12 cuotas sin interés!
        </p>
        <div className="mt-auto">
          <Link 
            to={`/product/${product.id}`} 
            className="btn btn-primary w-100 hover-lift"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

// Product List Component
const ProductList = () => {
  const [categories, setCategories] = useState({
    electronics: [],
    jewelery: [],
    mensClothing: [],
    womensClothing: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async (category) => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        if (!response.ok) throw new Error(`Error al cargar ${category}`);
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    };

    const loadAllCategories = async () => {
      try {
        const [electronics, jewelery, mensClothing, womensClothing] = await Promise.all([
          fetchCategory('electronics'),
          fetchCategory('jewelery'),
          fetchCategory("men's clothing"),
          fetchCategory("women's clothing")
        ]);

        setCategories({
          electronics,
          jewelery,
          mensClothing,
          womensClothing
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadAllCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-center mb-5">Nuestros Productos</h1>
      
      {/* Sección Tecnología */}
      <section id="technology" className="mb-5 pt-4">
        <div className="category-header">
          <div className="container">
            <h2 className="mb-0">Tecnología</h2>
            <p className="mb-0">Las mejores ofertas en productos tecnológicos</p>
          </div>
        </div>
        <div className="container">
          <div className="row g-4">
            {categories.electronics.map(product => (
              <div key={product.id} className="col-12 col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Joyería */}
      <section id="jewelery" className="mb-5 pt-4">
        <div className="category-header">
          <div className="container">
            <h2 className="mb-0">Joyería</h2>
            <p className="mb-0">Accesorios exclusivos para ti</p>
          </div>
        </div>
        <div className="container">
          <div className="row g-4">
            {categories.jewelery.map(product => (
              <div key={product.id} className="col-12 col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Moda Hombre */}
      <section id="mensClothing" className="mb-5 pt-4">
        <div className="category-header">
          <div className="container">
            <h2 className="mb-0">Moda Hombre</h2>
            <p className="mb-0">Las últimas tendencias en moda masculina</p>
          </div>
        </div>
        <div className="container">
          <div className="row g-4">
            {categories.mensClothing.map(product => (
              <div key={product.id} className="col-12 col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Moda Mujer */}
      <section id="womensClothing" className="mb-5 pt-4">
        <div className="category-header">
          <div className="container">
            <h2 className="mb-0">Moda Mujer</h2>
            <p className="mb-0">Descubre las últimas tendencias</p>
          </div>
        </div>
        <div className="container">
          <div className="row g-4">
            {categories.womensClothing.map(product => (
              <div key={product.id} className="col-12 col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Product Detail Component
const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Producto no encontrado');
        return response.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.title} className="img-fluid p-4" />
        </div>
        <div className="col-md-6">
          <h1>{product.title}</h1>
          <p className="h3 text-primary mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">{product.description}</p>
          <div className="d-flex align-items-center mb-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="mx-3">{quantity}</span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity(q => q + 1)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => addToCart(product, quantity)}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart View Component
const CartView = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-primary mt-3">Volver a la Tienda</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Carrito de Compras</h1>
      {cart.map(item => (
        <div key={item.id} className="card mb-3">
          <div className="row g-0">
            <div className="col-md-2">
              <img src={item.image} alt={item.title} className="img-fluid p-2" style={{ maxHeight: '150px', objectFit: 'contain' }} />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">${item.price.toFixed(2)}</p>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center justify-content-center">
              <button
                className="btn btn-danger"
                onClick={() => removeFromCart(item.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="card mt-4">
        <div className="card-body">
          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          <button
            className="btn btn-success mt-3"
            onClick={() => navigate('/checkout')}
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

// Checkout Component
const CheckoutSimulated = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-success">
          <h2>¡Gracias por tu compra!</h2>
          <p>Tu pedido ha sido procesado exitosamente.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')}
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellido</label>
            <input type="text" className="form-control" required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Ciudad</label>
            <input type="text" className="form-control" required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Código Postal</label>
            <input type="text" className="form-control" required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Tarjeta</label>
          <input type="text" className="form-control" placeholder="**** **** **** ****" required />
        </div>
        <button type="submit" className="btn btn-primary">
          Confirmar Compra
        </button>
      </form>
    </div>
  );
};

// Not Found Component
const NotFound = () => {
  return (
    <div className="container text-center py-5">
      <h1>404 - Página no encontrada</h1>
      <Link to="/" className="btn btn-primary mt-3">
        Volver al Inicio
      </Link>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/checkout" element={<CheckoutSimulated />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-light py-3 mt-auto">
            <div className="container text-center">
              <p className="mb-0">&copy; 2025 Tech Colonia. Todos los derechos reservados.</p>
            </div>
          </footer>
          <ToastContainer position="bottom-right" />
        </div>
      </CartProvider>
    </Router>
  );
};

export default App;
