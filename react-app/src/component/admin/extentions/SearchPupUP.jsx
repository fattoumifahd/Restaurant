import React from "react";

export default function SearchPupUP({similiers, name}) {
    console.log(similiers)
    console.log(name)
  return (
    <ul className="list-group">
        {similiers.map((num , i) => <li className="list-group-item"  key={i}><span className="text-primary">{name}</span>{num.slice(name.length) } </li> )}
    </ul>

  );
}
