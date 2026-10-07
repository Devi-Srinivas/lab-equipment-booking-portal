// Applies the "department-based access" edits to your own dashboard files.
// Run from the frontend folder:  node patch-department.cjs
const fs = require('fs');
const path = require('path');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Build a regex from a code snippet that ignores differences in spaces / line breaks
const flex = (snippet) => new RegExp(snippet.trim().split(/\s+/).map(esc).join('\\s+'));

const chip = `{user.department && <span className="ad-chipstat">{user.department}</span>}`;

const files = [
    {
        file: 'src/pages/AdminDashboard.jsx',
        edits: [
            {
                name: 'remove unused department options list',
                find: /const DEPT_OPTIONS = \[[^\]]*\];\s*/,
                replace: () => ''
            },
            {
                name: 'department is fixed in the Add form',
                find: /<Field label="Department">[\s\S]*?<\/Field>/,
                replace: () =>
                    `<Field label="Department">
                                        <input className="ad-input" type="text" value={user.department || 'Not set'} readOnly disabled />
                                        <div style={{ fontSize: 12, color: '#8fa196', marginTop: 6 }}>You can only add equipment to your own department.</div>
                                    </Field>`
            },
            {
                name: 'add payload uses the admin department',
                find: flex(`...formData, name: formData.equipmentName, availableQuantity: formData.totalQuantity`),
                replace: () =>
                    `...formData,
                department: user.department,
                name: formData.equipmentName,
                availableQuantity: formData.totalQuantity`
            },
            {
                name: 'update payload uses the admin department',
                find: /\.\.\.formData,\s*name: formData\.equipmentName\s*\}/,
                replace: () =>
                    `...formData,
                department: user.department,
                name: formData.equipmentName
            }`
            },
            {
                name: 'top bar shows the department',
                find: /<span>Hi\.\.\. \{username\}<\/span>/,
                replace: (m) => `${m}\n                    ${chip}`
            }
        ]
    },
    {
        file: 'src/pages/StudentDashboard.jsx',
        edits: [
            {
                name: 'top bar shows the department',
                find: /<span>Hi\.\.\. \{studentName\}<\/span>/,
                replace: (m) => `${m}\n                    ${chip}`
            },
            {
                name: 'booking card says which department is shown',
                find: flex(`<p className="ad-sub">Pick the equipment, date and time. The lab admin will review your request.</p>`),
                replace: () =>
                    `<p className="ad-sub">
                                {user.department && <>Showing <strong style={{ color: GREEN }}>{user.department}</strong> equipment. </>}
                                Pick the equipment, date and time. The lab admin will review your request.
                            </p>`
            },
            {
                name: 'message when no equipment is available',
                find: /<select className="ad-input" name="equipmentId"[\s\S]*?<\/select>/,
                replace: (m) =>
                    `${m}
                                    {equipmentList.length === 0 && (
                                        <div className="ad-slot-hint">No equipment is available for your department yet.</div>
                                    )}`
            }
        ]
    }
];

let failed = 0;

files.forEach(({ file, edits }) => {
    const full = path.resolve(process.cwd(), file);
    if (!fs.existsSync(full)) {
        console.log(`\n✘ ${file} not found. Run this script from the frontend folder.`);
        failed++;
        return;
    }

    const original = fs.readFileSync(full, 'utf8');
    const usesCRLF = original.includes('\r\n');
    let text = original.replace(/\r\n/g, '\n');

    console.log(`\n${file}`);
    edits.forEach((edit) => {
        if (!edit.find.test(text)) {
            // Already applied earlier? (the new text is present)
            console.log(`  ✘ not found / already applied: ${edit.name}`);
            failed++;
            return;
        }
        text = text.replace(edit.find, (...args) => edit.replace(args[0]));
        console.log(`  ✔ ${edit.name}`);
    });

    fs.writeFileSync(full + '.bak', original);                 // backup of your original
    fs.writeFileSync(full, usesCRLF ? text.replace(/\n/g, '\r\n') : text);
});

console.log(failed ? `\nFinished with ${failed} item(s) to check.` : '\nAll edits applied.');
console.log('Backups were saved as *.bak next to each file. Delete them when you are happy.');
