import { useState } from "react";

function Register() {

  const [formData, setFormData] = useState({
    username: "",
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
        "http://127.0.0.1:8000/api/utilisateurs/",
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

      alert("Inscription réussie !");

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>L'Agora</h1>

        <p style={styles.subtitle}>
          Créez votre compte étudiant
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Nom d'utilisateur
            </label>

            <input
              type="text"
              name="username"
              placeholder="Entrez votre nom"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

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
            S'inscrire
          </button>

        </form>

        <p style={styles.footer}>
          Déjà un compte ? Se connecter
        </p>

      </div>
    </div>
  );
}

const styles = {

  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to right, #4facfe, #00f2fe)",
    fontFamily: "Arial",
  },

  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "15px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#333",
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
    color: "#444",
    fontWeight: "bold",
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
    backgroundColor: "#4facfe",
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

export default Register;