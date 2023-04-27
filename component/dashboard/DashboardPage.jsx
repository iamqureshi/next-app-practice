import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import cheerio from "cheerio";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the URL is valid using regex
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!regex.test(url)) {
      setError("Invalid URL");
      setLoading(false);
      return;
    }

    // Check if the URL is safe using Google Safe Browsing API
    const safeBrowsingAPIKey = "AIzaSyAMsz0fnRzAH9F1mM8hUCslxa0I2HnCPp4";
    const safeBrowsingAPIEndpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${safeBrowsingAPIKey}`;

    try {
      const response = await axios.post(safeBrowsingAPIEndpoint, {
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      });

      if (response.data.matches) {
        setError("Malicious URL. Try with a different URL");
        setLoading(false);
        return;
      }

      // If the URL is safe, send a request to ScrapingBee API to get site information
      const scrapingBeeAPIKey =
        "X8U02QTUGKKCATGWBYEHGWT5E94TWX3OZ4QZB301UC7C6E8RW6PLY3ALD61KEX6WU4UB2I93WAJN459A";
      const scrapingBeeAPIEndpoint = `https://app.scrapingbee.com/api/v1/?api_key=${scrapingBeeAPIKey}&url=${url}`;

      const scrapingBeeResponse = await axios.get(scrapingBeeAPIEndpoint);

      // Use Cheerio to parse the HTML and get the desired fields
      const $ = cheerio.load(scrapingBeeResponse.data);

      const title = $('meta[property="og:title"]').attr("content");
      const description = $('meta[property="og:description"]').attr("content");
      const author = $('meta[name="author"]').attr("content");
      const image = $('meta[property="og:image"]').attr("content");
      const type = $('meta[property="og:type"]').attr("content");
      const canonicalURL = $('link[rel="canonical"]').attr("href");
      const locale = $("html").attr("lang");
      const publishedDate = $('meta[property="article:published_time"]').attr(
        "content"
      );

      // Set the data state with the parsed fields
      setData({
        title,
        description,
        author,
        image,
        type,
        canonicalURL,
        locale,
        publishedDate,
      });
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
      setLoading(false);
    }
  };

  console.log(data);
  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          id="url"
          label="Enter a URL:"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          error={Boolean(error) || false}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" type="submit" fullWidth>
          Submit
        </Button>
      </form>
      {error && (
        <Box sx={{ color: "error.main", mt: 2 }}>
          <Typography variant="subtitle1">{error}</Typography>
        </Box>
      )}
      {loading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {data && (
        <>
          <List sx={{ mt: 2 }}>
            <ListItem>
              <ListItemText primary={`Title: ${data.title || "N/A"}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Description: ${data.description || "N/A"}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={"Image"} />
              <Box sx={{ mt: 2 }}>
                <img src={data.image} alt="website" />
              </Box>
            </ListItem>
            <ListItem>
              <ListItemText primary={`Author: ${data.author || "N/A"}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Type: ${data.type || "N/A"}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`URL: ${url || "N/A"}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Locale: ${data.locale || "N/A"}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Published date: ${data.publishedDate || "N/A"}`}
              />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );
}
