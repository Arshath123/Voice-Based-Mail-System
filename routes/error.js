module.exports = (req, res, next) => {
  res.status(404).render("error", {
    pageTitle: "404 Page Not Found",
    error: "Page Not Found",
    layout: false
  });
};
