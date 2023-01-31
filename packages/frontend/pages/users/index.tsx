import React, { useEffect } from "react";
import { GetStaticProps } from "next";

import { User } from "../../interfaces";
import { sampleUserData } from "../../utils/sample-data";
import Layout from "../../components/Layout";
import List from "../../components/List";
import Input from "../../components/Input";

type Props = {
  items: User[];
};

const WithStaticProps = ({ items }: Props) => {
  const [search, setSearch] = React.useState("");

  const [users, setUsers] = React.useState<Props["items"]>([]);

  useEffect(() => {
    const filteredUsers = items.filter((item) =>
      item.name.toLocaleLowerCase().includes(search.toLowerCase())
    );
    setUsers(filteredUsers);
  }, [search]);

  return (
    <Layout title="Users List | Next.js + TypeScript Example">
      <div className="max-w-screen-xl	w-full m-auto py-10 px-20 sm:py-10 sm:px-20 px-5 py-2">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-4xl font-bold">Users List</h1>
          <h3>
            <strong>{users.length}</strong> Users
          </h3>
        </div>

        <Input search={search} setSearch={setSearch} />
        <List items={users} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: User[] = sampleUserData;
  return { props: { items } };
};

export default WithStaticProps;
