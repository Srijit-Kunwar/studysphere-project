/**
 * Generates a clean, neutral vector initials avatar in Forest Green (#1B4332).
 */
export function getDefaultAvatar(name: string, bg = '#1B4332', textColor = '#FFFFFF'): string {
  const cleanName = (name || 'User').trim();
  const initials = cleanName
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="50" fill="${bg}"/>
  <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="700" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
