import React from 'react';
import config from '../../../tailwind.config';

type ColorValue = string;
type ColorObject = {
  [key: string]: ColorValue | ColorObject;
};

const flattenColors = (obj: ColorObject, prefix = ''): { name: string; value: string }[] => {
  return Object.entries(obj).reduce((acc: { name: string; value: string }[], [key, value]) => {
    if (typeof value === 'string') {
      return [...acc, { name: prefix + key, value }];
    }
    return [...acc, ...flattenColors(value as ColorObject, `${prefix}${key}-`)];
  }, []);
};

const ColorSection = ({ title, colors }: { title: string; colors: { name: string; value: string }[] }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {colors.map((color) => (
        <div key={color.name} className="p-4 rounded-lg border">
          <div 
            className="w-full h-24 rounded-md mb-2"
            style={{ backgroundColor: color.value }}
          />
          <p className="font-mono text-sm">{color.name}</p>
          <p className="font-mono text-sm text-neutral-500">{color.value}</p>
        </div>
      ))}
    </div>
  </div>
);

const GradientSection = ({ title, gradients }: { 
  title: string; 
  gradients: { name: string; value: string }[] 
}) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {gradients.map((gradient) => (
        <div key={gradient.name} className="p-4 rounded-lg border">
          <div 
            className="w-full h-32 rounded-md mb-2"
            style={{ backgroundImage: gradient.value }}
          />
          <p className="font-mono text-sm">{gradient.name}</p>
          <p className="font-mono text-sm text-neutral-500">{gradient.value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function ColorsPage() {
  const { colors } = config.theme.extend;
  const { backgroundImage } = config.theme.extend;
  
  const peachColors = flattenColors(colors.peach as ColorObject, 'peach-');
  const lilacColors = flattenColors(colors.lilac as ColorObject, 'lilac-');
  const neutralColors = flattenColors(colors.neutral as ColorObject, 'neutral-');
  const stateColors = flattenColors(colors.state as ColorObject, 'state-');

  const gradients = [
    { name: 'gradient-peach', value: backgroundImage['gradient-peach'] },
    { name: 'gradient-peach-lilac', value: backgroundImage['gradient-peach-lilac'] },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Color System</h1>
      <ColorSection title="Peach Colors" colors={peachColors} />
      <ColorSection title="Lilac Colors" colors={lilacColors} />
      <ColorSection title="Neutral Colors" colors={neutralColors} />
      <ColorSection title="State Colors" colors={stateColors} />
      <GradientSection title="Gradients" gradients={gradients} />
    </div>
  );
}
