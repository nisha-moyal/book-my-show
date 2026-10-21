export const aboutController = {
  getAbout: (req, res) => {
    res.send({
      name: "Book My Show",
      version: "1.0.0",
      description: "Book My Show API",
    });
  },
};
