// function SignOut( {auth} ) {
//     return auth.currentUser && (
//         <button onClick={() => auth.signOut()}>Sign Out</button>
//     )
// }

// export default SignOut;

import React from 'react';
import { signOut } from 'firebase/auth';

function SignOut({ auth }) {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  );
}

export default SignOut;