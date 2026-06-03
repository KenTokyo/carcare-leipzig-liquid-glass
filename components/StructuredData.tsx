import React from 'react';
import JsonLd from './JsonLd';
import { baseOrganizationSchemas } from '../seo/structuredData';

const StructuredData: React.FC = () => <JsonLd data={baseOrganizationSchemas} />;

export default StructuredData;
