export interface Station {
  code: string;
  name: string;
  state?: string;
  zone?: string;
}

export const INDIAN_STATIONS: Station[] = [
  // Tamil Nadu & South India
  { code: 'MAS', name: 'MGR CHENNAI CENTRAL', state: 'Tamil Nadu' },
  { code: 'MS', name: 'CHENNAI EGMORE', state: 'Tamil Nadu' },
  { code: 'GDY', name: 'GUINDY', state: 'Tamil Nadu' },
  { code: 'TBM', name: 'TAMBARAM', state: 'Tamil Nadu' },
  { code: 'POTI', name: 'POTHERI', state: 'Tamil Nadu' },
  { code: 'CGL', name: 'CHENGALPATTU JN', state: 'Tamil Nadu' },
  { code: 'MBM', name: 'MAMBALAM', state: 'Tamil Nadu' },
  { code: 'PER', name: 'PERAMBUR', state: 'Tamil Nadu' },
  { code: 'MKK', name: 'KODAMBAKKAM', state: 'Tamil Nadu' },
  { code: 'AVD', name: 'AVADI', state: 'Tamil Nadu' },
  { code: 'TRL', name: 'TIRUVALLUR', state: 'Tamil Nadu' },
  { code: 'AJJ', name: 'ARAKKONAM JN', state: 'Tamil Nadu' },
  { code: 'KPD', name: 'KATPADI JN', state: 'Tamil Nadu' },
  { code: 'CBE', name: 'COIMBATORE JN', state: 'Tamil Nadu' },
  { code: 'MDU', name: 'MADURAI JN', state: 'Tamil Nadu' },
  { code: 'TPJ', name: 'TIRUCHCHIRAPPALLI JN', state: 'Tamil Nadu' },
  { code: 'SA', name: 'SALEM JN', state: 'Tamil Nadu' },
  { code: 'TEN', name: 'TIRUNELVELI JN', state: 'Tamil Nadu' },
  { code: 'ED', name: 'ERODE JN', state: 'Tamil Nadu' },
  { code: 'NCJ', name: 'NAGERCOIL JN', state: 'Tamil Nadu' },
  { code: 'VLNK', name: 'VELANKANNI', state: 'Tamil Nadu' },
  
  // Andhra Pradesh & Telangana
  { code: 'TPTY', name: 'TIRUPATI', state: 'Andhra Pradesh' },
  { code: 'RU', name: 'RENIGUNTA JN', state: 'Andhra Pradesh' },
  { code: 'BZA', name: 'VIJAYAWADA JN', state: 'Andhra Pradesh' },
  { code: 'VSKP', name: 'VISAKHAPATNAM JN', state: 'Andhra Pradesh' },
  { code: 'GNT', name: 'GUNTUR JN', state: 'Andhra Pradesh' },
  { code: 'NLNT', name: 'NELLORE', state: 'Andhra Pradesh' },
  { code: 'OGL', name: 'ONGOLE', state: 'Andhra Pradesh' },
  { code: 'KMT', name: 'KHAMMAM', state: 'Telangana' },
  { code: 'SC', name: 'SECUNDERABAD JN', state: 'Telangana' },
  { code: 'HYB', name: 'HYDERABAD DECCAN', state: 'Telangana' },
  { code: 'KCG', name: 'KACHEGUDA', state: 'Telangana' },
  { code: 'KZJ', name: 'KAZIPET JN', state: 'Telangana' },
  { code: 'WL', name: 'WARANGAL', state: 'Telangana' },

  // Karnataka & Kerala
  { code: 'SBC', name: 'KSR BENGALURU CITY JN', state: 'Karnataka' },
  { code: 'YPR', name: 'YESVANTPUR JN', state: 'Karnataka' },
  { code: 'SMVB', name: 'SMVT BENGALURU', state: 'Karnataka' },
  { code: 'MYS', name: 'MYSURU JN', state: 'Karnataka' },
  { code: 'UBL', name: 'SSS HUBBALLI JN', state: 'Karnataka' },
  { code: 'MAQ', name: 'MANGALURU CENTRAL', state: 'Karnataka' },
  { code: 'TVC', name: 'THIRUVANANTHAPURAM CENTRAL', state: 'Kerala' },
  { code: 'ERS', name: 'ERNAKULAM JN (SOUTH)', state: 'Kerala' },
  { code: 'CLT', name: 'KOZHIKODE MAIN', state: 'Kerala' },
  { code: 'CLT', name: 'PALAKKAD JN', state: 'Kerala' },

  // North & Central India
  { code: 'NDLS', name: 'NEW DELHI', state: 'Delhi' },
  { code: 'DLI', name: 'OLD DELHI JN', state: 'Delhi' },
  { code: 'NZM', name: 'HAZRAT NIZAMUDDIN', state: 'Delhi' },
  { code: 'ANVT', name: 'ANAND VIHAR TERMINAL', state: 'Delhi' },
  { code: 'LKO', name: 'LUCKNOW CHARBAGH', state: 'Uttar Pradesh' },
  { code: 'CNB', name: 'KANPUR CENTRAL', state: 'Uttar Pradesh' },
  { code: 'PRYJ', name: 'PRAYAGRAJ JN', state: 'Uttar Pradesh' },
  { code: 'BSB', name: 'VARANASI JN', state: 'Uttar Pradesh' },
  { code: 'AY', name: 'AYODHYA DHAM JN', state: 'Uttar Pradesh' },
  { code: 'AGC', name: 'AGRA CANTT', state: 'Uttar Pradesh' },
  { code: 'GKP', name: 'GORAKHPUR JN', state: 'Uttar Pradesh' },
  { code: 'PNBE', name: 'PATNA JN', state: 'Bihar' },
  { code: 'GAYA', name: 'GAYA JN', state: 'Bihar' },
  { code: 'JP', name: 'JAIPUR JN', state: 'Rajasthan' },
  { code: 'JU', name: 'JODHPUR JN', state: 'Rajasthan' },
  { code: 'UJZ', name: 'UDAIPUR CITY', state: 'Rajasthan' },

  // West & East India
  { code: 'CSMT', name: 'MUMBAI CSMT', state: 'Maharashtra' },
  { code: 'MMCT', name: 'MUMBAI CENTRAL', state: 'Maharashtra' },
  { code: 'LTT', name: 'LOKMANYA TILAK T', state: 'Maharashtra' },
  { code: 'DR', name: 'DADAR JN', state: 'Maharashtra' },
  { code: 'PUNE', name: 'PUNE JN', state: 'Maharashtra' },
  { code: 'NGP', name: 'NAGPUR JN', state: 'Maharashtra' },
  { code: 'ADI', name: 'AHMEDABAD JN', state: 'Gujarat' },
  { code: 'ST', name: 'SURAT', state: 'Gujarat' },
  { code: 'BRC', name: 'VADODARA JN', state: 'Gujarat' },
  { code: 'HWH', name: 'HOWRAH JN', state: 'West Bengal' },
  { code: 'SDAH', name: 'SEALDAH', state: 'West Bengal' },
  { code: 'KOAA', name: 'KOLKATA', state: 'West Bengal' },
  { code: 'NJP', name: 'NEW JALPAIGURI JN', state: 'West Bengal' },
  { code: 'BBS', name: 'BHUBANESWAR', state: 'Odisha' },
  { code: 'PURI', name: 'PURI', state: 'Odisha' },
  { code: 'GHY', name: 'GUWAHATI', state: 'Assam' }
];

export function searchStations(query: string): Station[] {
  if (!query || query.trim().length === 0) return INDIAN_STATIONS.slice(0, 8);
  const q = query.trim().toUpperCase();
  return INDIAN_STATIONS.filter(
    (s) => s.name.toUpperCase().includes(q) || s.code.toUpperCase().includes(q)
  ).slice(0, 10);
}
