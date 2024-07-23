import React from 'react'
interface Project {
  uid: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

interface UpdateInputProps {
  open: boolean;
  data: () => Promise<Project[]>;
  setOpenUpdate: (open: boolean) => void;
  setProjects: (projects: Project[]) => void;
}

const UpdatedPost = ({
  open,
  data,
  setOpenUpdate,
  setProjects,
}: UpdateInputProps) => {
  if (!open) return null;

  return (
    <div>UpdatedPost</div>
  );
}

export default UpdatedPost