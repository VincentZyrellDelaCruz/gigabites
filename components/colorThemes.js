export const getColors = (isDarkMode) => ({
  // For buttons, highlights, active icons
  accentColor: isDarkMode ? '#FFB84D' : '#FF8C42',

  // For backgrounds
  backgroundColor: isDarkMode ? '#1E1E1E' : '#FDFCF9',

  // Subtle primary branding color for headers, borders, etc.
  primaryColor: isDarkMode ? '#8BC34A' : '#689F38', // mellow green tones

  // Secondary accents for cards or highlights
  secondaryColor: isDarkMode ? '#81C784' : '#A7D8C1',

  // General text
  textColor: isDarkMode ? '#FAFAFA' : '#212121',

  // Secondary/alternate/muted text
  mutedTextColor: isDarkMode ? '#BDBDBD' : '#757575',
  altTextColor: isDarkMode ? '#212121' : '#FAFAFA',

  // For card and surface backgrounds
  surfaceColor: isDarkMode ? '#2E2E2E' : '#FFFFFF',

  // For button text color 
  buttonTextColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',

  // Gives red color (mostly for errors or requirements)
  errorColor: isDarkMode ? '#EF9A9A' : '#D32F2F',

  // For null or unselected components
  grayColor: isDarkMode ? '#666666' : '#D3D3D3',

  // For both light and dark mode
  black: '#1E1E1E',
  white: '#FDFCF9',
});
