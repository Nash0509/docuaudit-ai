import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import useStore from "../utils/Store";
import DocumentFilters from "../components/documents/DocumentFilters";
import DocumentTable from "../components/dashboard/DocumentTable";

export default function Documents() {
  const setTopBar = useStore(state => state.setTopBar);

  useEffect(() => {
    setTopBar("documents");
  }, []);

  return (
    <Layout>
      <DocumentFilters />
      <DocumentTable variant='documents'/>
    </Layout>
  );
}
