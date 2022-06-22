import React, { createContext } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:1337/api";

const initialState = () => ({
  user: localStorage.getItem("strapi")
    ? JSON.parse(localStorage.getItem("strapi")).user
    : null,
  token: localStorage.getItem("strapi")
    ? JSON.parse(localStorage.getItem("strapi")).token
    : null,
  assets: {
    allAssets: null,
    asset: null,
  },
});
// create context
export const generalContext = createContext({});
export const StateAndEndpointHOC = (props) => {
  const [state, setState] = React.useState(initialState);
  let config = {
    headers: {
      authorization: "Bearer " + state.token || null,
    },
  };
  const endpoints = {
    login: async (params, callback) => {
      try {
        const res = await axios.post("/auth/local", params);
        if (callback && typeof callback === "function") {
          callback(res, null);
        }
        console.log(res.data.user);
        setState(() => ({
          ...state,
          token: res?.data?.jwt,
          user: res.data.user,
        }));
        localStorage.setItem(
          "strapi",
          JSON.stringify({
            token: res?.data?.jwt,
            user: res?.data?.user,
          })
        );
        return res;
      } catch (err) {
        console.log(err.response.data.error.message);
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
        throw new Error(err);
      }
    },

    signup: async (params, callback) => {
      try {
        const res = await axios.post("/auth/local/register", params);
        if (callback && typeof callback === "function") {
          callback(res, null);
        }
        setState(() => ({
          ...state,
          token: res?.data?.jwt,
          user: res?.data?.user,
        }));
        localStorage.setItem(
          "strapi",
          JSON.stringify({
            token: res?.data?.jwt,
            user: res?.data?.user,
          })
        );
        return res;
      } catch (err) {
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
        throw new Error(err);
      }
    },

    getAssets: async (callback) => {
      try {
        const res = await axios.get("/assets", config);
        if (callback && typeof callback === "function") {
          callback(res, null);
        }
        setState(() => ({
          ...state,
          assets: { ...state.assets, allAssets: res?.data?.data },
        }));
        return res;
      } catch (err) {
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
        throw new Error(err);
      }
    },

    getSingleAsset: async (id, callback) => {
      try {
        const res = await axios.get(`/assets/${id}`, config);
        setState(() => ({
          ...state,
          assets: { ...state.assets, asset: res?.data?.data },
        }));
        if (callback && typeof callback === "function") {
          callback(res, null);
        }
        return res;
      } catch (err) {
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
        throw new Error(err);
      }
    },

    deleteSingleAsset: async (id, callback) => {
      try {
        const res = await axios.delete(`/assets/${id}`, config);
        if (callback && typeof callback === "function") {
          callback(res, null);
        }
        return res;
      } catch (err) {
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
        throw new Error(err);
      }
    },

    createAssets: async (data, callback) => {
      try {
        const res = await axios.post("/assets", { data }, config);
        if (callback && typeof callback === "function") {
          callback(res, null);
        }
        return res;
      } catch (err) {
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
        throw new Error(err);
      }
    },

    editAssets: async (id, data, callback) => {
      try {
        const res = await axios.put("/assets/" + id, { data }, config);
        if (callback && typeof callback === "function") {
          callback(res, null);
        }
        return res;
      } catch (err) {
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
        throw new Error(err);
      }
    },

    logout: () => {
      localStorage.removeItem("strapi");
      setState({ ...initialState });
    },
  };
  const allProps = { ...state, setState, endpoints };

  return <props.app {...allProps} />;
};
