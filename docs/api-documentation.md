# Grok Image Generation API Documentation

This document provides information about the Grok image generation API used in the XImage application.

## API Endpoint

The Grok image generation API is accessible at:

```
https://api.x.ai/v1/images/generations
```

## Authentication

All API requests require authentication using an API key. The API key should be included in the request headers:

```
Authorization: Bearer xai-J73Q00yW6dsQdRrxRTwN2AVuIn1kK56IL9OrWIws4QwWYiWlxLVagdpsfFvCPM0te6LQ2M0t3jSjVm0f
```

## Request Format

### Image Generation

To generate images from a text prompt, send a POST request to the endpoint with the following JSON body:

```json
{
  "model": "grok-2-image-1212",
  "prompt": "Your detailed text prompt here",
  "n": 1
}
```

Parameters:

- `model` (string, required): The model to use for image generation. Use "grok-2-image-1212" for the latest version.
- `prompt` (string, required): A detailed text description of the image you want to generate.
- `n` (integer, optional): The number of images to generate. Default is 1. Maximum is 4.

## Response Format

The API returns a JSON response with the following structure:

```json
{
  "created": 1649358979,
  "data": [
    {
      "url": "https://example.com/image.jpg",
      "b64_json": "base64_encoded_image_data"
    }
  ]
}
```

- `created` (integer): Unix timestamp indicating when the request was processed.
- `data` (array): An array of generated image objects.
  - `url` (string): URL to the generated image (if available).
  - `b64_json` (string): Base64-encoded image data (if available).

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad request (e.g., missing required parameters)
- 401: Unauthorized (invalid API key)
- 429: Rate limit exceeded
- 500: Server error

Error responses include a JSON body with details:

```json
{
  "error": {
    "message": "Error message describing the issue",
    "type": "error_type",
    "code": "error_code"
  }
}
```

## Usage Examples

### cURL Example

```bash
curl -X POST \
  https://api.x.ai/v1/images/generations \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "model": "grok-2-image-1212",
    "prompt": "A serene mountain landscape with a lake at sunset",
    "n": 1
  }'
```

### JavaScript Example

```javascript
const axios = require('axios');

async function generateImage() {
  try {
    const response = await axios.post(
      'https://api.x.ai/v1/images/generations',
      {
        model: 'grok-2-image-1212',
        prompt: 'A serene mountain landscape with a lake at sunset',
        n: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`
        }
      }
    );
    
    console.log(response.data);
  } catch (error) {
    console.error('Error generating image:', error.response?.data || error.message);
  }
}

generateImage();
```

## Rate Limits

The API has rate limits based on your account tier. Exceeding these limits will result in a 429 error.

## Best Practices

1. **Detailed Prompts**: Provide detailed and specific prompts for better results.
2. **Error Handling**: Implement robust error handling in your application.
3. **API Key Security**: Keep your API key secure and never expose it in client-side code.
4. **Caching**: Consider caching generated images to reduce API calls.
5. **User Experience**: Implement loading states and error messages for a better user experience.
