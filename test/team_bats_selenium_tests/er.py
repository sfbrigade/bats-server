from selenium import webdriver
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.common.keys import Keys
# from bs4 import BeautifulSoup as BS

class ERTest():
    def __init__(self):
        self.driver = webdriver.Chrome(ChromeDriverManager().install())
    
    def login(self):
        self.driver.get('https://bats-dev.herokuapp.com/auth/local/login')
        sleep(2)
        email = self.driver.find_element_by_xpath('//*[@id="email"]')
        email.send_keys('op.healthcare@c4sf.me')
        password = self.driver.find_element_by_xpath('//*[@id="password"]')
        password.send_keys('abcd1234')
        login_button = self.driver.find_element_by_xpath('/html/body/div/div/div/form/button')
        login_button.click()

    def increase_er_beds(self):
        increase_button = self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div[1]/form/fieldset/div[1]/div/button[2]')
        increase_button.click()

    def decrease_er_beds(self):
        decrease_button = self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div[1]/form/fieldset/div[1]/div/button[1]')
        decrease_button.click()

    def update_notes(self):
        notes = self.driver.find_element_by_xpath('//*[@id="additionalNotes"]')
        notes.send_keys('The HVAC system is dripping watch out for puddles.')
    
    def accept_ringdown(self):
        view = self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div/button')
        view.click()
        confirm = self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div/button')
        confirm.click()
    def integration(self):
        while True:
            try:
                self.accept_ringdown()
            except Exception:
                sleep(0.5)
    
bot = ERTest()
bot.login()
bot.integration()