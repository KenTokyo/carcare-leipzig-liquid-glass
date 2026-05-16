export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'Pflege' | 'Reparatur' | 'Spezial';
  iconName: string;
  image?: string;
  price?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  type: string;
  location: string;
}

export interface NavLink {
  label: string;
  href: string;
}