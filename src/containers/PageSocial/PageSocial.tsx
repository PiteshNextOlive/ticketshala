import { FC, Fragment, useState, useContext } from 'react' 
import FacebookSignIn from "./FacebookSignIn";
import GoogleSignIn from "./GoogleSignIn";

const PageSocial = () => {

  return (

    <div className="max-w-md mx-auto space-y-6">
      <div className="flex justify-between">
        <FacebookSignIn from="login" />

        <GoogleSignIn from="login" />
      </div>

    </div>
  );
};

export default PageSocial;
