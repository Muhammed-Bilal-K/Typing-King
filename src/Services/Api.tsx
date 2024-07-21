import axios from "axios";

export const fetchNewParagraph = async () => {
  try {
    const response = await axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text');
    const fullParagraph = response.data;

    const words = fullParagraph.split(' ');
    const limitedParagraph = words.slice(0, 20).join(' ');

    return limitedParagraph;
  } catch (error) {
    console.error('Error fetching new paragraph:', error);
    return "Default text for error handling.";
  }
};