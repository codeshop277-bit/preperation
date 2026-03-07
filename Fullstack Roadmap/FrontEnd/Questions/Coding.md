# File structure
```js
const data = [
  {
    id: 1,
    name: "src",
    type: "folder",
    children: [
      { id: 2, name: "App.js", type: "file" },
      { id: 3, name: "index.js", type: "file" },
      {
        id: 4,
        name: "components",
        type: "folder",
        children: [{ id: 5, name: "Header.js", type: "file" }]
      }
    ]
  },
  { id: 6, name: "package.json", type: "file" }
];

// 2. Recursive Tree Rendering
// A folder can contain folders, so recursion is ideal.
function FileNode({ node }) {
  const [open, setOpen] = React.useState(false);

  if (node.type === "file") {
    return <div style={{ paddingLeft: 20 }}>📄 {node.name}</div>;
  }

  return (
    <div style={{ paddingLeft: 20 }}>
      <div onClick={() => setOpen(!open)}>
        📁 {node.name}
      </div>

      {open &&
        node.children?.map(child => (
          <FileNode key={child.id} node={child} />
        ))}
    </div>
  );
}
// 3. Root Component
export default function App() {
  return (
    <div>
      {data.map(node => (
        <FileNode key={node.id} node={node} />
      ))}
    </div>
  );
}
// 4. Adding File / Folder (Common Interview Follow-up)
// Update tree immutably.
function addNode(tree, parentId, newNode) {
  return tree.map(node => {
    if (node.id === parentId && node.type === "folder") {
      return {
        ...node,
        children: [...(node.children || []), newNode]
      };
    }

    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentId, newNode)
      };
    }

    return node;
  });
}
setTree(prev =>
  addNode(prev, 4, { id: Date.now(), name: "Footer.js", type: "file" })
);
```