import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AccessibilityEnhancements() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Apply accessibility modifications to document
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (isReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [fontSize, isHighContrast, isReducedMotion]);

  return (
    <div className="fixed top-20 right-4 z-40" role="complementary" aria-label="Accessibility controls">
      <Card className="p-4 bg-white/95 backdrop-blur-sm border shadow-lg">
        <h3 className="font-semibold mb-3 text-sm" id="accessibility-heading">
          Accessibility Options
        </h3>
        
        <div className="space-y-3" role="group" aria-labelledby="accessibility-heading">
          <div>
            <label htmlFor="font-size-control" className="block text-xs font-medium mb-1">
              Font Size: {fontSize}%
            </label>
            <input
              id="font-size-control"
              type="range"
              min="75"
              max="150"
              step="25"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
              aria-describedby="font-size-description"
            />
            <div id="font-size-description" className="text-xs text-gray-600 sr-only">
              Adjust text size from 75% to 150% of normal size
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHighContrast(!isHighContrast)}
            className="w-full text-xs"
            aria-pressed={isHighContrast}
            aria-describedby="contrast-description"
          >
            {isHighContrast ? 'Disable' : 'Enable'} High Contrast
          </Button>
          <div id="contrast-description" className="text-xs text-gray-600 sr-only">
            Toggle high contrast mode for better text visibility
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReducedMotion(!isReducedMotion)}
            className="w-full text-xs"
            aria-pressed={isReducedMotion}
            aria-describedby="motion-description"
          >
            {isReducedMotion ? 'Enable' : 'Disable'} Animations
          </Button>
          <div id="motion-description" className="text-xs text-gray-600 sr-only">
            Toggle animations and motion effects
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AccessibilityEnhancements;