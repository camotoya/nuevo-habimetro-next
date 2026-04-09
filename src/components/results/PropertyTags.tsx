'use client';

interface PropertyTagsProps {
  formData: {
    address?: string;
    cityName?: string;
    propertyType?: number;
    area?: number;
    rooms?: number;
    bathrooms?: number;
    garages?: number;
    stratum?: number;
    age?: number;
  };
}

const propertyTypeLabels: Record<number, string> = {
  1: 'Apartamento',
  2: 'Casa',
};

export default function PropertyTags({ formData }: PropertyTagsProps) {
  const tags: { value: string; label: string }[] = [];

  if (formData.address) {
    tags.push({ value: formData.address, label: '' });
  }
  if (formData.cityName) {
    tags.push({ value: formData.cityName, label: '' });
  }
  if (formData.propertyType) {
    tags.push({ value: propertyTypeLabels[formData.propertyType] || 'Inmueble', label: '' });
  }
  if (formData.area) {
    tags.push({ value: `${formData.area}`, label: 'm²' });
  }
  if (formData.rooms) {
    tags.push({ value: `${formData.rooms}`, label: formData.rooms === 1 ? 'habitación' : 'habitaciones' });
  }
  if (formData.bathrooms) {
    tags.push({ value: `${formData.bathrooms}`, label: formData.bathrooms === 1 ? 'baño' : 'baños' });
  }
  if (formData.garages !== undefined && formData.garages > 0) {
    tags.push({ value: `${formData.garages}`, label: formData.garages === 1 ? 'garaje' : 'garajes' });
  }
  if (formData.stratum) {
    tags.push({ value: `Estrato ${formData.stratum}`, label: '' });
  }
  if (formData.age !== undefined && formData.age >= 0) {
    tags.push({ value: `${formData.age}`, label: formData.age === 1 ? 'año' : 'años' });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full"
        >
          <strong>{tag.value}</strong>
          {tag.label && <span className="font-normal">{tag.label}</span>}
        </span>
      ))}
    </div>
  );
}
