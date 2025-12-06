import User from "../models/UserModel.js";
import Products from "../models/ProductModel.js";
import bcrypt from "bcrypt"; // Add this import
import jwt from "jsonwebtoken"; 
import { keycloakConfig } from "../config/KeycloakConfig.js";

// Helper to get Admin Token (needed to create users)
const getAdminToken = async () => {
    const data = qs.stringify({
        client_id: "admin-cli",
        username: keycloakConfig.adminUsername,
        password: keycloakConfig.adminPassword,
        grant_type: "password"
    });

    const response = await axios.post(
        `${keycloakConfig.url}/realms/master/protocol/openid-connect/token`,
        data,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data.access_token;
};

// 1. REGISTER: Create a user in Keycloak
const doRegister = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const adminToken = await getAdminToken();

        // Keycloak Admin API to create user
        await axios.post(
            `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users`,
            {
                username: username,
                email: email,
                enabled: true,
                credentials: [{
                    type: "password",
                    value: password,
                    temporary: false
                }]
            },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(201).json({ message: 'User registered successfully in Keycloak' });

    } catch (error) {
        // Handle case where user already exists
        if (error.response && error.response.status === 409) {
            return res.status(409).json({ message: 'User already exists' });
        }
        console.error("Register Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

// 2. LOGIN: Exchange username/password for a Token
const doLogin = async (req, res) => {
    const { username, password } = req.body;

    // Prepare data for Keycloak Token Endpoint
    const data = qs.stringify({
        client_id: keycloakConfig.clientId,
        client_secret: keycloakConfig.clientSecret, // Only required if Access Type is 'Confidential'
        username: username,
        password: password,
        grant_type: "password"
    });

    try {
        const response = await axios.post(
            `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
            data,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        // Return the token to the user
        res.json({
            message: 'Login successful',
            token: response.data.access_token,
            refreshToken: response.data.refresh_token
        });

    } catch (error) {
        console.error("Login Error:", error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(500).json({ message: 'Error logging in' });
    }
}

const showUsernames = async (req, res) => {
    try {
        const usernames = await User.findAll();
        res.status(200).json(usernames);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Cannot get all usernames" });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Products.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addProduct = async (req, res) => {
  try {
    const { product_name, description, qty } = req.body;

    const newProduct = await Products.create({
      product_name,
      description,
      qty,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

const editProduct = async (req, res) => {
    try {
        const {
            product_name,
            description,
            qty
        } = req.body;
        const productId = req.params.id;
        const result = await Products.update(
            { product_name, description, qty},
            {
                where: {
                    id: productId,
                },
            }
        );

        if (result[0] === 0) {
            return res
                .status(404)
                .json({ msg: "Product not found or unauthorized" });
        }

        res.status(200).json({ msg: "Product Updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log("Deleting product ID:", productId);

        const result = await Products.destroy({
            where: {
                id: productId,
            },
        });

        if (result) {
            res.json({ message: "Product deleted successfully!" });
        } else {
            res.status(404).json({ error: "Product not found!" });
        }
    } catch (error) {
        console.error("Error deleting Product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export { doLogin, doRegister, showUsernames, getProducts, getProductById, addProduct, editProduct, deleteProduct};