import Layout from "../components/layout/Layout";

import DocumentFilters from "../components/documents/DocumentFilters";

import DocumentTable from "../components/dashboard/DocumentTable";

export default function Documents() {
  return (
    <Layout>
      <DocumentFilters />
      <DocumentTable variant='documents'/>
    </Layout>
  );
}
