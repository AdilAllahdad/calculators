'use client';

import { useState, useEffect } from 'react';
import UnitDropdown from '@/components/UnitDropdown';
import { convertValue } from '@/lib/utils';

export default function BoilerSizeCalculator() {
    const [boilerType, setBoilerType] = useState<string>('Combi');
    
}