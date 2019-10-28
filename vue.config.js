const path = "/app";
const server = "carto19.ethz.ch";

module.exports = {
  publicPath: path + "/",
  devServer: {
    openPage: path,
    before(app) {
      const publicPathRedirect = (req, res) => {
        res.redirect(path + "/");
      };
      app.get("/", publicPathRedirect);
      app.get("/index.html", publicPathRedirect);
    },
    proxy: {
      "/geoserver": {
        target: "http://" + server,
        changeOrigin: true
      }
    }
  }
};
