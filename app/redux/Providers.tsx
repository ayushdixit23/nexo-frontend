"use client"; // If you're using Next.js 13+ App Router

import { Provider } from "react-redux"; // Import Provider from react-redux
import store from "./store"; // Import the Redux store

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
