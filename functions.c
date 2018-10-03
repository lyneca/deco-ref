void pinMode(int pin, int mode);
// :param pin: The pin to set up
// :param mode: INPUT or OUTPUT
// :tags: pins setup
// :week: 3
// Initialises a pin for input or output.
// Call this function in the setup() function for every pin you plan to use.

int digitalRead(int pin);
// :param pin: The pin to read from
// :tags: pins input
// :week: 3
// :returns: The value of the pin being read
// Reads a digital signal (HIGH or LOW) from a pin.

void digitalWrite(int pin, int value);
// :param pin: The pin to write to
// :param value: The value to be written (HIGH or LOW)
// :tags: pins output
// :week: 3
// Writes a digital signal (HIGH or LOW) to a pin.

int analogRead(int pin);
// :param pin: The pin to read from (A0-A5)
// :returns: The analog value of the pin: 0 to 1023
// :tags: pins input analog
// :week: 3
// Reads an analog signal from a pin.

void analogWrite(int pin, int value);
// :param pin: The pin to write to (A0-A5)
// :param value: The value to write (0-1023)
// :tags: pins output analog
// :week: 3
// Writes an analog value to a pin.

void Serial.begin(int baudrate);
// :param baudrate: The baudrate (speed) of the connection
// :tags: serial setup
// :week: 4
// Initialises a serial connection. Usually set to 9600.
// Must be called in setup() to enable the use of the Serial library.

void Serial.print(any item);
// :param item: The data you want to print
// :tags: serial debug
// :week: 4
// Prints data to the computer over serial, without the trailing newline.

void Serial.println(any item);
// :param item: The data you want to print
// :tags: serial debug
// :week: 4
// Prints data to the computer over serial, including the trailing newline.

void tone(int pin, float frequency, float duration);
// :param pin: The pin that the buzzer is connected to
// :param frequency: The frequency to play
// :param duration opt: How long to play for
// :tags: output pwm audio
// :week: 5
// Plays a frequency on a particular pin.
// You can optionally specify a duration, and the tone will play and stop after that duration while your code continues to run. 

void noTone(int pin);
// :param pin: The pin to silence
// :tags: output pwm audio
// :week: 5
// Immediately stops all tones on a pin.

void CurieIMU.begin();
// :tags: curie imu setup
// :week: 5
// Initialises the Curie IMU library.

void CurieIMU.setAccelerometerRange(int range)
// :param range: The range of the accelerometer: 2, 4, 8 or 16
// :tags: curie imu setup
// :week: 5
// Sets the range of the accelerometer - the minimum and maximum values that it can record.
// Higher values mean less precision, but a greater maximum acceleration that can be measured.
// Values of 2 or 4 should suffice in most cases.

void CurieIMU.readAccelerometer(int x, int y, int z);
// :param x: A variable that the function will fill with the X acceleration value
// :param y: A variable that the function will fill with the Y acceleration value
// :param z: A variable that the function will fill with the Z acceleration value
// :tags: curie imu input
// :week: 5
// Reads x, y and z acceleration values into the variables provided.
// Values will be between -32,768 and 32,768, and what these numbers represent depend on the accelerometer range set in CurieIMU.setAccelerometerRange().
// If the accelerometer range is 2, then -32,768 represents negative two times earth gravity, and 32,768 represents two times earth gravity.

void CurieIMU.readAccelerometerScaled(float x, float y, float z);
// :param x: A variable that the function will fill with the X acceleration value
// :param y: A variable that the function will fill with the Y acceleration value
// :param z: A variable that the function will fill with the Z acceleration value
// :tags: curie imu input
// :week: 5
// Reads x, y and z acceleration values into the variables provided, scaling and converting them to G-force.
