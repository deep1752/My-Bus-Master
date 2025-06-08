/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  exportPathMap: async function (defaultPathMap) {
    // Remove /successPay from static export
    delete defaultPathMap['/successPay'];
    return defaultPathMap;
  },
};

export default nextConfig;


