import { useState } from "react";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log(data);

      alert("Connexion réussie !");

    } catch (error) {

      console.error(error);

      alert("Erreur de connexion");

    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.leftSection}>
        <h1 style={styles.brand}>L'Agora</h1>

        <p style={styles.description}>
          Une plateforme étudiante interactive dédiée
          à l’entraide, au partage et à la solidarité
          universitaire.
        </p>
      </div>

      <div style={styles.card}>

        <h2 style={styles.title}>Connexion</h2>

        <p style={styles.subtitle}>
          Connectez-vous à votre compte
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.inputGroup}>

            <label style={styles.label}>
              Adresse Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="exemple@email.com"
              onChange={handleChange}
              style={styles.input}
              required
            />

          </div>

          <div style={styles.inputGroup}>

            <label style={styles.label}>
              Mot de passe
            </label>

            <input
              type="password"
              name="password"
              placeholder="********"
              onChange={handleChange}
              style={styles.input}
              required
            />

          </div>

          <button type="submit" style={styles.button}>
            Se connecter
          </button>

        </form>

        <p style={styles.footer}>
          Vous n’avez pas de compte ? S’inscrire
        </p>

      </div>
    </div>
  );
}

const styles = {

  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background:
      "linear-gradient(to right, #141e30, #243b55)",
    fontFamily: "Arial",
    padding: "0 80px",
  },

  leftSection: {
    color: "white",
    width: "40%",
  },

  brand: {
    fontSize: "60px",
    marginBottom: "20px",
  },

  description: {
    fontSize: "20px",
    lineHeight: "1.6",
    color: "#dcdcdc",
  },

  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "15px",
    width: "380px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#222",
  },

  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: "30px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    marginBottom: "8px",
    display: "block",
    fontWeight: "bold",
    color: "#444",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#243b55",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
    color: "gray",
    fontSize: "14px",
  },
};

export default Login;