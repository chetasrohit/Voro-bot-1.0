const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DB_PATH } = require('./database');

// Connect to database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database for seeding...');
});

// Clear existing data (optional - comment out if you want to keep existing data)
function clearExistingData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM options', (err) => {
        if (err) {
          console.error('Error clearing options:', err);
          reject(err);
          return;
        }
        db.run('DELETE FROM topics', (err) => {
          if (err) {
            console.error('Error clearing topics:', err);
            reject(err);
            return;
          }
          console.log('Cleared existing data');
          resolve();
        });
      });
    });
  });
}

// Seed new data
function seedData() {
  return new Promise((resolve, reject) => {
    const topics = [
      {
        key: 'certificates',
        name: '📜 Certificates & Documents',
        icon: '📜',
        options: [
          {
            option_key: 'A',
            title: 'Leaving Certificate',
            description: 'How to get your Leaving Certificate',
            answer: 'We issue the Leaving Certificate along with the SSC and HSC marksheet.'
          },
          {
            option_key: 'B',
            title: 'Duplicate Leaving Certificate',
            description: 'How to get a duplicate Leaving Certificate',
            answer: 'Submit a written application explaining how it was lost. A police complaint copy may be required. A duplicate LC usually takes 3–5 days, sometimes up to 10–15 working days.'
          },
          {
            option_key: 'C',
            title: 'Bonafide Certificate',
            description: 'Details needed for Bonafide Certificate',
            answer: 'We need your full name, class/division, GR number, and the purpose (for example, bank, scholarship, Aadhaar, concession).'
          },
          {
            option_key: 'D',
            title: 'Bonafide Processing Time',
            description: 'How many days for Bonafide Certificate',
            answer: 'It usually takes 3 working days. In urgent cases, it may be issued on the same day if possible.'
          },
          {
            option_key: 'E',
            title: 'Character Certificate',
            description: 'How to get Character Certificate',
            answer: 'Yes. Submit an application. We can issue it based on your school/college admission records. It takes 4–5 days.'
          },
          {
            option_key: 'F',
            title: 'Railway Concession',
            description: 'How to apply for Railway Concession',
            answer: 'Collect the form from the office counter and submit it along with your concession card and route details (From–To). The concession is usually issued in 3–4 days.'
          }
        ]
      },
      {
        key: 'admission',
        name: '🎓 Admission',
        icon: '🎓',
        options: [
          {
            option_key: 'A',
            title: 'Documents for Std. 8th and 9th',
            description: 'Required documents for Std. 8th and 9th admission',
            answer: 'Std. 8 admission requires the Std. 7 result. Std. 9 admission requires the Std. 8 result.\n\nDocuments needed:\n• Previous school LC\n• Birth Certificate\n• Aadhaar Card\n• Report Card\n• Passport-size photos\n• Caste Certificate (if applicable)'
          },
          {
            option_key: 'B',
            title: 'Std. 11th Admission Process',
            description: 'Online admission process for Std. 11th',
            answer: 'Admission is completely online through the Government of Maharashtra website: https://mahafyjcadmissions.in/landing\n\nGo to the login tab, register yourself, and upload the required documents. The form will be auto-verified. More than 10 rounds are conducted.\n\nAdmission categories:\n• Management Quota – Open for all\n• Minority Quota – 50% seats reserved for Catholic students\n• In-House Quota – 12% seats reserved for students of Academic Dr. Antonio da Silva & Dr. Antonio da Silva Technical, Dadar\n• Merit Round – For all categories based on percentage\n\nDocuments needed:\n• Previous school LC\n• SSC Marksheet\n• 11th Admission Registration Form\n• Aadhaar Card\n• Report Card\n• Passport-size photos\n• Caste Certificate (if applicable)'
          },
          {
            option_key: 'C',
            title: 'Admission Form Availability',
            description: 'When will admission forms be available?',
            answer: 'Admission forms are available at the school office during office hours. The dates are announced on the notice board or website.'
          },
          {
            option_key: 'D',
            title: 'Change Division or Class',
            description: 'Can I change my division or class?',
            answer: 'Division changes are allowed only for valid reasons (health, travel, siblings). Approval from the Principal is required.'
          }
        ]
      },
      {
        key: 'results',
        name: '📊 Results & Marksheets',
        icon: '📊',
        options: [
          {
            option_key: 'A',
            title: 'Check 10th and 12th Results',
            description: 'Where to check SSC and HSC results',
            answer: 'You can check your result on the board website: www.mahahsscboard.maharashtra.gov.in using your seat number. You can collect the marksheet or Passing Certificate from the school after the result day.'
          },
          {
            option_key: 'B',
            title: 'Duplicate Marksheet',
            description: 'How to get duplicate marksheet',
            answer: 'Yes. The student must submit a police NC along with an application. The school/college will issue a letter to the Board Office. A duplicate marksheet takes 3–4 weeks to be issued by the Board.'
          },
          {
            option_key: 'C',
            title: 'Exam Timetable',
            description: 'When will exam timetable be released?',
            answer: 'The timetable will be shared at least 2–3 weeks before the exam on the notice board and class groups.'
          }
        ]
      },
      {
        key: 'fees',
        name: '💰 Fees & Payments',
        icon: '💰',
        options: [
          {
            option_key: 'A',
            title: 'How to Pay Fees',
            description: 'Payment process for school/college fees',
            answer: 'Collect the fee slip from the office.\n• School Section: Pay at Bank of Maharashtra, Bhawani Shankar Road, Dadar.\n• College Section: Pay at Citizen Bank, Kabutar Khana, Dadar.\n\nAfter payment, submit the school copy in the office.'
          },
          {
            option_key: 'B',
            title: 'Fee Receipt Copy',
            description: 'How to get copy of fee receipt',
            answer: 'Yes. The office will provide a copy within 4–5 working days.'
          },
          {
            option_key: 'C',
            title: 'Current Fee Structure',
            description: 'What are the fees for this year?',
            answer: 'The current fee structure is available at the school office.'
          }
        ]
      },
      {
        key: 'concessions',
        name: '🎫 Concessions & Forms',
        icon: '🎫',
        options: [
          {
            option_key: 'A',
            title: 'Caste Validity (Junior College)',
            description: 'How to apply for Caste Validity',
            answer: 'Collect Form 15-A from the college office. Apply with an affidavit, complete the form on barti.gov.in, download the completed form, and submit it to the Principal\'s Office. A covering letter will be issued to the respective regional office.'
          },
          {
            option_key: 'C',
            title: 'Domicile and Non-Creamy Layer',
            description: 'How to apply for Domicile certificates',
            answer: 'Visit the Collector Office (Mumbai City or Suburban) for the application process.'
          },
          {
            option_key: 'D',
            title: 'SSC and HSC Board Forms',
            description: 'When are Board forms filled?',
            answer: 'Forms are usually issued after the Ganpati vacation for the next academic exam.'
          }
        ]
      },
      {
        key: 'general',
        name: 'ℹ️ General Information',
        icon: 'ℹ️',
        options: [
          {
            option_key: 'A',
            title: 'Office Timings',
            description: 'What are the office timings?',
            answer: 'The school office is open from 9:00 AM to 1:00 PM (Monday to Saturday).'
          },
          {
            option_key: 'B',
            title: 'School ID Card',
            description: 'Who to contact for school ID card?',
            answer: 'Contact the school office. If the ID card is damaged or lost, submit a request for a duplicate.'
          },
          {
            option_key: 'C',
            title: 'Change Name/Caste in Register',
            description: 'How to change caste or name in General Register',
            answer: 'Submit an application along with proof such as Gazette copy, Aadhaar Card, and Caste Certificate.'
          },
          {
            option_key: 'D',
            title: 'Attendance Correction',
            description: 'My attendance is marked absent by mistake',
            answer: 'Inform your class teacher or the office immediately. We will verify and correct it in the system.'
          }
        ]
      }
    ];

    let topicIndex = 0;
    let completed = 0;
    const total = topics.length;

    function insertNextTopic() {
      if (topicIndex >= total) {
        console.log('All topics seeded successfully!');
        resolve();
        return;
      }

      const topic = topics[topicIndex];
      topicIndex++;

      // Check if topic exists
      db.get('SELECT id FROM topics WHERE key = ?', [topic.key], (err, existing) => {
        if (err) {
          console.error(`Error checking topic ${topic.key}:`, err);
          reject(err);
          return;
        }

        let topicId;
        if (existing) {
          // Update existing topic
          topicId = existing.id;
          db.run(
            'UPDATE topics SET name = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [topic.name, topic.icon, topicId],
            function(updateErr) {
              if (updateErr) {
                console.error(`Error updating topic ${topic.key}:`, updateErr);
                reject(updateErr);
                return;
              }
              console.log(`✓ Updated topic: ${topic.name} (ID: ${topicId})`);
              
              // Delete existing options for this topic
              db.run('DELETE FROM options WHERE topic_id = ?', [topicId], (deleteErr) => {
                if (deleteErr) {
                  console.error(`Error deleting options for ${topic.key}:`, deleteErr);
                  reject(deleteErr);
                  return;
                }
                insertOptions(topicId, topic);
              });
            }
          );
        } else {
          // Insert new topic
          db.run(
            'INSERT INTO topics (key, name, icon, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [topic.key, topic.name, topic.icon],
            function(insertErr) {
              if (insertErr) {
                console.error(`Error inserting topic ${topic.key}:`, insertErr);
                reject(insertErr);
                return;
              }

              topicId = this.lastID;
              console.log(`✓ Inserted topic: ${topic.name} (ID: ${topicId})`);
              insertOptions(topicId, topic);
            }
          );
        }

        function insertOptions(topicId, topic) {

          // Insert options for this topic
          if (topic.options && topic.options.length > 0) {
            let optionIndex = 0;
            const insertOption = db.prepare(`
              INSERT INTO options (topic_id, option_key, title, description, answer, updated_at) 
              VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);

            function insertNextOption() {
              if (optionIndex >= topic.options.length) {
                insertOption.finalize();
                completed++;
                insertNextTopic();
                return;
              }

              const option = topic.options[optionIndex];
              optionIndex++;

              insertOption.run(
                [topicId, option.option_key, option.title, option.description || '', option.answer],
                (err) => {
                  if (err) {
                    console.error(`Error inserting option ${option.option_key} for ${topic.key}:`, err);
                    insertOption.finalize();
                    reject(err);
                    return;
                  }
                  console.log(`  ✓ Inserted option: ${option.option_key} - ${option.title}`);
                  insertNextOption();
                }
              );
            }

            insertNextOption();
          } else {
            completed++;
            insertNextTopic();
          }
        }
      });
    }

    insertNextTopic();
  });
}

// Main execution
async function main() {
  try {
    // Uncomment the line below if you want to clear existing data first
    // await clearExistingData();
    
    await seedData();
    console.log('\n✅ Data seeding completed successfully!');
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    db.close();
    process.exit(1);
  }
}

main();

