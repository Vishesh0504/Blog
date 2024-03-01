import { createFileRoute,Outlet} from "@tanstack/react-router";
import {lazy, Suspense} from 'react';

const LoadingAnimation = lazy(()=>import('../Animations/LoginAnimation'));
export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <div
      className={`py-24 px-44 flex gap-12 dark:text-text-dark text-text-light  dark:divide-gray-600 divide-gray-300 items-center justify-between max-xl:px-32 max-lg:px-24 max-lg:py-16 max-md:p-12`}
    >
      <div className="w-1/2 max-sm:hidden">
        <Suspense >
        <LoadingAnimation/>

        </Suspense>
      </div>


      <Outlet/>
    </div>
  );
}
