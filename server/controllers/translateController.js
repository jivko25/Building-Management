const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY
});

const translateText = async (req, res) => {
  console.log("Translation request received:", req.body);

  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "Липсват задължителни полета"
      });
    }

    if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
      console.error("Google Translate API key is missing");
      return res.status(500).json({
        success: false,
        message: "Конфигурационна грешка: Липсва API ключ"
      });
    }

    const [translation] = await translate.translate(text, targetLanguage);
    console.log("Translation successful:", translation);

    res.json({
      success: true,
      translatedText: translation
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      success: false,
      message: "Грешка при превода",
      error: error.message
    });
  }
};

module.exports = {
  translateText
};
