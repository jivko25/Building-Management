"use strict";

function getRandomDateWithinLastMonth() {
  const now = new Date(); // Текущата дата
  const pastMonth = new Date(); // Създаваме копие на текущата дата
  pastMonth.setMonth(now.getMonth() - 1); // Месец назад

  // Генерираме произволна дата между pastMonth и сега
  return new Date(pastMonth.getTime() + Math.random() * (now.getTime() - pastMonth.getTime()));
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});

    await queryInterface.bulkInsert(
      "tbl_workitems",
      [
        {
          id: 1,
          task_id: 1,
          project_id: 1,
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 2,
          measure_id: 1,
          artisan_id: 1,
          quantity: 10.0,
          note: "Шпакловка стени",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false,
          creator_id: 2,
          total_artisan_price: getRandomNumber(50, 150),
          total_manager_price: getRandomNumber(50, 150),
          created_at: getRandomDateWithinLastMonth(),
        },
        {
          id: 2,
          task_id: 1,
          project_id: 1,
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 2,
          measure_id: 1,
          artisan_id: 1,
          quantity: 15.0,
          note: "Шпакловка таван",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false,
          creator_id: 2,
          total_artisan_price: getRandomNumber(50, 150),
          total_manager_price: getRandomNumber(50, 150),
          created_at: getRandomDateWithinLastMonth(),
        },
        {
          id: 3,
          task_id: 2,
          project_id: 2,
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 3,
          measure_id: 1,
          artisan_id: 2,
          quantity: 30.0,
          note: "Саниране фасада",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false,
          creator_id: 2,
          total_artisan_price: getRandomNumber(50, 150),
          total_manager_price: getRandomNumber(50, 150),
          created_at: getRandomDateWithinLastMonth(),
        },
        {
          id: 4,
          task_id: 2,
          project_id: 2,
          start_date: new Date(),
          end_date: new Date(),
          activity_id: 3,
          measure_id: 1,
          artisan_id: 2,
          quantity: 20.0,
          note: "Саниране цокъл",
          status: "done",
          is_client_invoiced: false,
          is_artisan_invoiced: false,
          creator_id: 2,
          total_artisan_price: getRandomNumber(50, 150),
          total_manager_price: getRandomNumber(50, 150),
          created_at: getRandomDateWithinLastMonth(),
        },
        {
          id: 5,
          task_id: 3,
          project_id: 3,
          start_date: new Date(),
          end_date: null,
          activity_id: 4,
          measure_id: 2,
          artisan_id: 3,
          quantity: getRandomNumber(1, 50),
          note: "Допълнителен запис",
          status: "in_progress",
          is_client_invoiced: true,
          is_artisan_invoiced: true,
          creator_id: 3,
          total_artisan_price: getRandomNumber(50, 150),
          total_manager_price: getRandomNumber(50, 150),
          created_at: getRandomDateWithinLastMonth(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_workitems", null, {});
  },
};
