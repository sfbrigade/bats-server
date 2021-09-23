from selenium import webdriver
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class EMSTest():
    def __init__(self):
        self.driver = webdriver.Chrome(ChromeDriverManager().install())
    
    def login(self):
        self.driver.get('https://bats-dev.herokuapp.com/auth/local/login')
        sleep(1)
        email = self.driver.find_element_by_xpath('//*[@id="email"]')
        email.send_keys('op.ems@c4sf.me')
        password = self.driver.find_element_by_xpath('//*[@id="password"]')
        password.send_keys('abcd1234')
        login_button = self.driver.find_element_by_xpath('/html/body/div/div/div/form/button')
        login_button.click()

    def fill_out_form(self):
        unit = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div[1]/fieldset[1]/div/div/span[3]/button')
        sleep(1)
        unit.click()
        number = self.driver.find_element_by_xpath('//*[@id="ambulanceIdentifier--list--option-0"]')
        sleep(1)
        number.click()
        incident = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div[1]/fieldset[2]/div/div/span[3]/button')
        sleep(1)
        incident.click()
        incident_num = self.driver.find_element_by_xpath('//*[@id="dispatchCallNumber--list--option-0"]')
        incident_num.click()
        age = self.driver.find_element_by_xpath('//*[@id="age"]')
        age.send_keys('26')
        gender = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div[2]/fieldset[2]/div/div[1]/label')
        gender.click()
        urgency = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div[2]/fieldset[3]/div/div[1]/label')
        urgency.click()
        complaint = self.driver.find_element_by_xpath('//*[@id="chiefComplaintDescription"]')
        complaint.send_keys('This is a test. But how cool is this?')
        vitals = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div[2]/fieldset[5]/div/div[1]/label')
        vitals.click()
        systolic = self.driver.find_element_by_xpath('//*[@id="systolicBloodPressure"]')
        systolic.send_keys('159')
        diastolic = self.driver.find_element_by_xpath('//*[@id="systolicBloodPressure"]')
        diastolic.send_keys('64')
        pulse = self.driver.find_element_by_xpath('//*[@id="heartRateBpm"]')
        pulse.send_keys('64')
        breath = self.driver.find_element_by_xpath('//*[@id="respiratoryRate"]')
        breath.send_keys('64')
        sp_02 = self.driver.find_element_by_xpath('//*[@id="oxygenSaturation"]')
        sp_02.send_keys('93')
        oxygen = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div[3]/fieldset/div[5]/div[2]/div[1]/label')
        oxygen.click()
        liters = self.driver.find_element_by_xpath('//*[@id="supplementalOxygenAmount"]')
        liters.send_keys('8')
        temp = self.driver.find_element_by_xpath('//*[@id="temperature"]')
        temp.send_keys('98.6')
        covid = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div[4]/fieldset/div[6]/label')
        covid.click()
        other_text = self.driver.find_element_by_xpath('//*[@id="otherObservationNotes"]')
        other_text.send_keys('Wow. This is a speedy test.')
        select_hospital = self.driver.find_element_by_xpath('//*[@id="root"]/form/fieldset/button[1]')
        sleep(0.5)
        select_hospital.click()

    def select_hospital(self):
        hospital = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[2]/div/fieldset[1]/div[1]/label')
        hospital.click()
        eta = self.driver.find_element_by_xpath('//*[@id="etaMinutes"]')
        eta.send_keys('5')
        send_ringdown = self.driver.find_element_by_xpath('//*[@id="root"]/form/fieldset/button[1]')
        sleep(0.5)
        send_ringdown.click()

    def redirect(self):
        sleep(0.5)
        redirect_button = self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div/fieldset[2]/button[1]')
        redirect_button.click()
        confirm_redirect = self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div/fieldset[2]/div/div/div/ul/li[1]/button')
        confirm_redirect.click()
        sleep(0.5)
        return_to_list = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[3]/div/div/ul/li[1]/button')
        return_to_list.click()

    
    def cancel(self):
        sleep(0.5)
        cancel_button = self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div/fieldset[2]/button[2]')
        cancel_button.click()
        confirm_cancel= self.driver.find_element_by_xpath('//*[@id="root"]/div[2]/div/fieldset[2]/div/div/div/ul/li[1]/button')
        confirm_cancel.click()
        sleep(0.5)
        return_to_list = self.driver.find_element_by_xpath('//*[@id="root"]/form/div[3]/div/div/ul/li/button')
        return_to_list.click()

i = 0
while i < 10 :
    bot = EMSTest()
    bot.login()
    sleep(2)
    bot.fill_out_form()
    sleep(0.5)
    bot.select_hospital()
    bot.redirect()
    sleep(0.5)
    bot.select_hospital()
    sleep(0.5)
    bot.cancel()
    bot.driver.close()
    i += 1
