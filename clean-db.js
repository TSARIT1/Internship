const { runSSHCommand } = require('./deploy-vps');

async function cleanDatabase() {
  console.log('Cleaning demo & test data on VPS database...');
  const sql = `mysql -u root -pTsarit@12345 internship << 'EOF'
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE contact_queries;
TRUNCATE TABLE anti_cheat_logs;
TRUNCATE TABLE quiz_attempts;
DELETE FROM users WHERE role = 'STUDENT' OR email LIKE '%example.com%' OR email LIKE '%test%' OR username = 'Jabi';
SET FOREIGN_KEY_CHECKS = 1;
SELECT id, username, email, role FROM users;
SELECT COUNT(*) AS remaining_leads FROM contact_queries;
SELECT COUNT(*) AS remaining_enrollments FROM enrollments;
EOF`;
  
  const result = await runSSHCommand(sql);
  console.log('Clean complete. Output:\n', result.stdout);
}

cleanDatabase().catch(err => {
  console.error('Clean failed:', err);
  process.exit(1);
});
