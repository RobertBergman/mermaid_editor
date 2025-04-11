import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { saveAs } from 'file-saver';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Paper,
  Typography,
  CssBaseline,
  Link,
  SelectChangeEvent,
  IconButton,
  Alert,
  AlertTitle,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

// Initialize mermaid configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'monospace',
});

type Theme = 'default' | 'forest' | 'dark' | 'neutral';

const MermaidEditor: React.FC = () => {
  const [code, setCode] = useState<string>(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('default');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to render the diagram
  const renderDiagram = async () => {
    try {
      setError('');
      const renderId = `mermaid-diagram-${Date.now()}`;
      const { svg } = await mermaid.render(renderId, code);
      setSvg(svg);
    } catch (err: any) {
      console.error('Mermaid rendering error:', err);
      setError(`Error rendering diagram: ${err.message || 'Unknown error'}`);
      setSvg('');
    }
  };

  // Re-render diagram when code or theme changes
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      securityLevel: 'loose',
      fontFamily: 'monospace',
    });
    renderDiagram();
  }, [code, theme]);

  // Function to save diagram as PNG using file-saver
  const saveDiagramAsPng = () => {
    setError(''); // Clear previous errors
    if (!previewContainerRef.current) {
        console.error("Save Error: Preview container ref is not set.");
        setError("Preview container not found.");
        return;
    }
    const svgElement = previewContainerRef.current.querySelector('svg');
    if (!svgElement) {
        console.error("Save Error: SVG element not found within the preview container.");
        setError("Could not find SVG element to save. Ensure the diagram rendered correctly.");
        return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Save Error: Could not get 2D canvas context.");
        setError("Could not get canvas context. Your browser might not support it.");
        return;
    }

    const img = new Image();
    // Convert SVG string to data URL directly
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;


    img.onload = () => {
      const { width, height } = svgElement.getBoundingClientRect();

      if (width === 0 || height === 0) {
          console.error("Save Error: SVG dimensions are zero.", { width, height });
          setError("SVG dimensions are zero. Cannot save image. Try resizing the window or ensure the diagram is visible.");
          // No URL to revoke here
          return;
      }

      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      // URL can be revoked here as it's loaded into the image

      canvas.toBlob((blob) => {
        if (blob) {
          try {
            saveAs(blob, 'mermaid-diagram.png');
            setError(''); // Clear error on success
          } catch (saveError: any) {
              console.error("FileSaver saveAs error:", saveError);
              setError(`Failed to save file: ${saveError.message}`);
          }
        } else {
            console.error("Save Error: canvas.toBlob callback received null blob.");
            setError("Failed to create PNG blob from canvas.");
        }
        // No URL to revoke here
      }, 'image/png');
    };

    img.onerror = (errorEvent) => {
        console.error("Save Error: Image loading failed.", errorEvent);
        setError("Failed to load SVG data URL into image element. The SVG might be invalid or corrupted, or the data URL construction failed.");
        // No URL to revoke here
    }

    img.crossOrigin = 'anonymous'; // Keep this in case the SVG references external resources
    img.src = svgDataUrl; // Use the data URL
  };

  // Handle code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Handle theme change
  const handleThemeChange = (event: SelectChangeEvent<Theme>) => {
    setTheme(event.target.value as Theme);
  };

  // Toggle fullscreen view for the diagram
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mermaid Diagram Editor (MUI)
        </Typography>

        {/* Use Flexbox for layout instead of Grid */}
        <Box sx={{ display: 'flex', flexGrow: 1, gap: 2 }}>
          {/* Editor Column */}
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Mermaid Code
            </Typography>
            <TextField
              multiline
              fullWidth
              value={code}
              onChange={handleCodeChange}
              variant="outlined"
              placeholder="Enter your mermaid diagram code here..."
              sx={{ flexGrow: 1, '& .MuiInputBase-root': { height: '100%' }, '& textarea': { fontFamily: 'monospace', height: '100% !important', overflowY: 'auto !important' } }}
            />
          </Box>

          {/* Preview Column */}
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h2">
                  Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                   <Select
                      value={theme}
                      onChange={handleThemeChange}
                      size="small"
                      variant="outlined"
                  >
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="forest">Forest</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="neutral">Neutral</MenuItem>
                  </Select>
                  <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={saveDiagramAsPng}
                      size="small"
                  >
                      Save PNG
                  </Button>
                   <IconButton onClick={toggleFullScreen} size="small" title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
              </Box>
            </Box>
            <Paper
              variant="outlined"
              sx={{
                flexGrow: 1,
                p: 2,
                overflow: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: isFullScreen ? 'fixed' : 'relative',
                inset: isFullScreen ? 0 : 'auto',
                zIndex: isFullScreen ? 1300 : 'auto',
                bgcolor: 'background.paper',
                height: isFullScreen ? '100vh' : 'auto',
                width: isFullScreen ? '100vw' : 'auto',
              }}
            >
              {error ? (
                 <Alert severity="error" sx={{width: '100%'}}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
              ) : (
                <Box
                  ref={previewContainerRef}
                  dangerouslySetInnerHTML={{ __html: svg }}
                  sx={{
                    width: '100%', // Ensure the container fills the Paper
                    height: '100%', // Ensure the container fills the Paper
                    display: 'flex', // Use flex to center the SVG if needed
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                        width: '100%', // Make SVG fill container width
                        height: '100%', // Make SVG fill container height
                    }
                  }}
                />
              )}
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need help with Mermaid syntax? Check out the{' '}
            <Link
              href="https://mermaid.js.org/syntax/flowchart.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mermaid documentation
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default MermaidEditor;
