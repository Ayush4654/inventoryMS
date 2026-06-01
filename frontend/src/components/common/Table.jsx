export default function Table({ columns, data, renderActions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
            ))}
            {renderActions && <th className="px-4 py-3 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {renderActions && <td className="px-4 py-3">{renderActions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
