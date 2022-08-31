import React from 'react';
import { IoEllipseSharp } from 'react-icons/io5';

interface Props {
  className?: string;
}

const Divider = ({ className }: Props) => {
  return (
    <div className={`flex flex-row mx-auto my-2 mb-3 ${className}`}>
      <IoEllipseSharp size={15} className="mx-1"/>
      <IoEllipseSharp size={15} className="mx-1"/>
      <IoEllipseSharp size={15} className="mx-1"/>
    </div>
  )
};

export default Divider;