package com.expensio.backend.config;

import com.expensio.backend.entity.Budget;
import com.expensio.backend.entity.Expense;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.repository.BudgetRepository;
import com.expensio.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    @Override
    public void run(String... args) {
        if (expenseRepository.count() == 0) {
            log.info("Database is empty. Seeding sample expenses and budgets...");

            LocalDate now = LocalDate.now();
            LocalDate startOfThisMonth = now.withDayOfMonth(1);
            LocalDate startOfLastMonth = now.minusMonths(1).withDayOfMonth(1);

            // 1. Seed Budgets
            Budget overallBudget = new Budget();
            overallBudget.setAmount(BigDecimal.valueOf(25000.00));
            overallBudget.setPeriodMonth(startOfThisMonth);
            overallBudget.setCategory(null); // overall

            Budget foodBudget = new Budget();
            foodBudget.setAmount(BigDecimal.valueOf(8000.00));
            foodBudget.setPeriodMonth(startOfThisMonth);
            foodBudget.setCategory(ExpenseCategory.FOOD);

            Budget billBudget = new Budget();
            billBudget.setAmount(BigDecimal.valueOf(6000.00));
            billBudget.setPeriodMonth(startOfThisMonth);
            billBudget.setCategory(ExpenseCategory.BILLS);

            budgetRepository.saveAll(List.of(overallBudget, foodBudget, billBudget));

            // 2. Seed Expenses for Last Month (to demonstrate analytics trends)
            Expense lastMonth1 = new Expense();
            lastMonth1.setTitle("Electricity Bill - July");
            lastMonth1.setAmount(BigDecimal.valueOf(3200.00));
            lastMonth1.setCategory(ExpenseCategory.BILLS);
            lastMonth1.setExpenseDate(startOfLastMonth.plusDays(4));
            lastMonth1.setDescription("Summer cooling peak charges");

            Expense lastMonth2 = new Expense();
            lastMonth2.setTitle("Monthly Groceries");
            lastMonth2.setAmount(BigDecimal.valueOf(4500.00));
            lastMonth2.setCategory(ExpenseCategory.FOOD);
            lastMonth2.setExpenseDate(startOfLastMonth.plusDays(10));

            Expense lastMonth3 = new Expense();
            lastMonth3.setTitle("Train Ticket Home");
            lastMonth3.setAmount(BigDecimal.valueOf(1200.00));
            lastMonth3.setCategory(ExpenseCategory.TRANSPORT);
            lastMonth3.setExpenseDate(startOfLastMonth.plusDays(18));

            // 3. Seed Expenses for This Month
            Expense thisMonth1 = new Expense();
            thisMonth1.setTitle("Grocery Shopping D-Mart");
            thisMonth1.setAmount(BigDecimal.valueOf(2450.00));
            thisMonth1.setCategory(ExpenseCategory.FOOD);
            thisMonth1.setExpenseDate(startOfThisMonth.plusDays(2));

            Expense thisMonth2 = new Expense();
            thisMonth2.setTitle("Internet Broadband Bill");
            thisMonth2.setAmount(BigDecimal.valueOf(999.00));
            thisMonth2.setCategory(ExpenseCategory.BILLS);
            thisMonth2.setExpenseDate(startOfThisMonth.plusDays(5));

            Expense thisMonth3 = new Expense();
            thisMonth3.setTitle("Petrol Refuel");
            thisMonth3.setAmount(BigDecimal.valueOf(1500.00));
            thisMonth3.setCategory(ExpenseCategory.TRANSPORT);
            thisMonth3.setExpenseDate(startOfThisMonth.plusDays(7));

            Expense thisMonth4 = new Expense();
            thisMonth4.setTitle("Weekend Movie & Snacks");
            thisMonth4.setAmount(BigDecimal.valueOf(850.00));
            thisMonth4.setCategory(ExpenseCategory.ENTERTAINMENT);
            thisMonth4.setExpenseDate(startOfThisMonth.plusDays(10));

            Expense thisMonth5 = new Expense();
            thisMonth5.setTitle("Nike Running Shoes");
            thisMonth5.setAmount(BigDecimal.valueOf(5500.00));
            thisMonth5.setCategory(ExpenseCategory.SHOPPING);
            thisMonth5.setExpenseDate(startOfThisMonth.plusDays(12));
            thisMonth5.setDescription("Purchased during seasonal sale");

            Expense thisMonth6 = new Expense();
            thisMonth6.setTitle("Office Cafeteria lunch");
            thisMonth6.setAmount(BigDecimal.valueOf(320.00));
            thisMonth6.setCategory(ExpenseCategory.FOOD);
            thisMonth6.setExpenseDate(startOfThisMonth.plusDays(14));

            expenseRepository.saveAll(List.of(
                    lastMonth1, lastMonth2, lastMonth3,
                    thisMonth1, thisMonth2, thisMonth3, thisMonth4, thisMonth5, thisMonth6
            ));

            log.info("Database successfully seeded with 9 expenses and 3 budgets.");
        } else {
            log.info("Database already contains records. Skipping seeder.");
        }
    }
}
